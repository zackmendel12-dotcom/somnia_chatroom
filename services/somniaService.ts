import {
  Address,
  createPublicClient,
  createWalletClient,
  defineChain,
  Hex,
  http,
  keccak256,
  PublicClient,
  toHex,
  WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { SDK, SchemaEncoder, zeroBytes32 } from '@somnia-chain/streams';

import {
  RPC_URL,
  CHAT_SCHEMA,
} from '../constants';
import { Message } from '../types';

// Define Somnia Testnet Chain
const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  rpcUrls: {
    default: { http: [RPC_URL] },
    public: { http: [RPC_URL] },
  },
});

type MessageCallback = (messages: Message[]) => void;

export interface SomniaServiceConfig {
  walletClient: WalletClient;
  publicClient?: PublicClient;
  rpcUrl?: string;
}

export class SomniaService {
  private sdk: SDK;
  private publicClient: PublicClient;
  private walletClient: WalletClient;
  private encoder = new SchemaEncoder(CHAT_SCHEMA);
  private pollingInterval: number | null = null;
  private seenMessages: Set<string> = new Set();

  constructor(config: SomniaServiceConfig) {
    this.walletClient = config.walletClient;
    
    const defaultPublicClient = createPublicClient({
      chain: somniaTestnet,
      transport: http(config.rpcUrl || RPC_URL),
    });
    
    this.publicClient = (config.publicClient || defaultPublicClient) as PublicClient;

    this.sdk = new SDK({
      public: this.publicClient,
      wallet: this.walletClient,
    });
  }

  /**
   * Register a chat schema on-chain
   * @param schemaId - The schema ID to register
   * @param schema - The schema definition string
   * @returns The transaction hash if registration was performed, null if already registered
   */
  public async registerChatSchema(
    schemaId: Hex,
    schema: string = CHAT_SCHEMA
  ): Promise<Hex | null> {
    const isRegistered = await this.sdk.streams.isDataSchemaRegistered(schemaId);
    if (isRegistered) {
      console.log('Schema is already registered.');
      return null;
    }

    console.log('Schema not registered. Registering...');
    const txHash = await this.sdk.streams.registerDataSchemas(
      [{ id: schemaId, schema, parentSchemaId: zeroBytes32 as Hex }],
      true
    );

    if (txHash) {
      await this.publicClient.waitForTransactionReceipt({ hash: txHash as Hex });
      console.log('Schema registered successfully.');
      return txHash as Hex;
    }

    return null;
  }

  /**
   * Get all messages for a specific room
   * @param schemaId - The schema ID to query
   * @param roomId - The room ID to filter by
   * @param publisherAddress - The address of the message publisher
   * @param currentUser - The current user's name for determining message sender type
   * @returns Array of messages sorted by timestamp
   */
  public async getRoomMessages(
    schemaId: Hex,
    roomId: string,
    publisherAddress: Address,
    currentUser?: string
  ): Promise<Message[]> {
    const allData = await this.sdk.streams.getAllPublisherDataForSchema(schemaId, publisherAddress);

    if (!Array.isArray(allData)) {
      return [];
    }

    const messages: Message[] = [];
    const val = (field: any) => field?.value?.value ?? field?.value ?? '';

    for (const row of (allData as any[][])) {
      if (!Array.isArray(row) || row.length < 5) continue;
      
      const timestamp = Number(val(row[0]));
      const messageRoomId = String(val(row[1]));
      const content = String(val(row[2]));
      const senderName = String(val(row[3]));
      const senderAddress = String(val(row[4]));

      // Filter by room ID
      if (messageRoomId !== roomId) continue;

      const messageId = `${timestamp}-${senderName}-${content}`;

      messages.push({
        id: messageId,
        timestamp,
        roomId: messageRoomId,
        text: content,
        senderName,
        senderAddress,
        sender: currentUser && senderName === currentUser ? 'self' : 'other',
      });
    }
    
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Publish a message to a room
   * @param text - The message text
   * @param senderName - The sender's display name
   * @param roomId - The room ID
   * @param schemaId - The schema ID to use
   * @returns The transaction hash
   */
  public async publishMessage(
    text: string,
    senderName: string,
    roomId: string,
    schemaId: Hex
  ): Promise<Hex> {
    const now = Date.now();

    if (!this.walletClient.account) {
      throw new Error('Wallet client account is not available');
    }

    const payload: Hex = this.encoder.encodeData([
      { name: 'timestamp', value: now.toString(), type: 'uint64' },
      { name: 'roomId', value: toHex(roomId, { size: 32 }), type: 'bytes32' },
      { name: 'content', value: text, type: 'string' },
      { name: 'senderName', value: senderName, type: 'string' },
      { name: 'sender', value: this.walletClient.account.address, type: 'address' },
    ]);

    const uniqueString = `${roomId}-${senderName}-${now}`;
    const dataId = keccak256(toHex(uniqueString));

    const tx = await this.sdk.streams.set([{ id: dataId, schemaId, data: payload }]);

    if (!tx) {
      throw new Error('Failed to publish message.');
    }

    await this.publicClient.waitForTransactionReceipt({ hash: tx as Hex });
    return tx as Hex;
  }

  /**
   * Subscribe to new messages in a room with polling
   * @param callback - Function to call when new messages arrive
   * @param schemaId - The schema ID to monitor
   * @param roomId - The room ID to filter by
   * @param publisherAddress - The address of the message publisher
   * @param currentUser - The current user's name
   * @param pollIntervalMs - Polling interval in milliseconds (default: 5000)
   */
  public subscribeToMessages(
    callback: MessageCallback,
    schemaId: Hex,
    roomId: string,
    publisherAddress: Address,
    currentUser: string,
    pollIntervalMs: number = 5000
  ): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    this.seenMessages.clear();

    const poll = async () => {
      try {
        const allData = await this.sdk.streams.getAllPublisherDataForSchema(schemaId, publisherAddress);

        if (!Array.isArray(allData)) {
          return;
        }

        const newMessages: Message[] = [];
        const val = (field: any) => field?.value?.value ?? field?.value ?? '';

        for (const row of (allData as any[][])) {
          if (!Array.isArray(row) || row.length < 5) continue;
          
          const timestamp = Number(val(row[0]));
          const messageRoomId = String(val(row[1]));
          const content = String(val(row[2]));
          const senderName = String(val(row[3]));
          const senderAddress = String(val(row[4]));

          // Filter by room ID
          if (messageRoomId !== roomId) continue;

          const messageId = `${timestamp}-${senderName}-${content}`;

          if (this.seenMessages.has(messageId)) {
            continue;
          }
          this.seenMessages.add(messageId);

          newMessages.push({
            id: messageId,
            timestamp,
            roomId: messageRoomId,
            text: content,
            senderName,
            senderAddress,
            sender: senderName === currentUser ? 'self' : 'other',
          });
        }
        
        if (newMessages.length > 0) {
          callback(newMessages);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    
    // Initial poll with a small delay to allow UI to settle
    setTimeout(poll, 1000); 
    this.pollingInterval = window.setInterval(poll, pollIntervalMs);
  }

  /**
   * Unsubscribe from message polling
   */
  public unsubscribe(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

// Factory function to create a service instance with a private key (for server-side use)
export function createServiceWithPrivateKey(privateKey: string, rpcUrl?: string): SomniaService {
  const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey as Hex : `0x${privateKey}` as Hex);
  const walletClient = createWalletClient({
    account,
    chain: somniaTestnet,
    transport: http(rpcUrl || RPC_URL),
  });
  
  return new SomniaService({ walletClient, rpcUrl });
}

// Factory function to create a service instance with a wallet client (for client-side use with wagmi)
export function createServiceWithWalletClient(
  walletClient: WalletClient,
  publicClient?: PublicClient
): SomniaService {
  return new SomniaService({ walletClient, publicClient });
}
