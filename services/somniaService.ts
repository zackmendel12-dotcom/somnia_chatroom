// FIX: Import specific functions from 'viem' and 'viem/accounts' instead of using a namespace import.
import {
  Address,
  createPublicClient,
  createWalletClient,
  defineChain,
  Hex,
  http,
  keccak256,
  toHex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { SDK, SchemaEncoder, zeroBytes32 } from '@somnia-chain/streams';

import {
  RPC_URL,
  PRIVATE_KEY,
  CHAT_SCHEMA,
  NEXT_PUBLIC_CHAT_SCHEMA_ID,
} from '../constants';
import { Message } from '../types';

// Define Somnia Testnet Chain
// FIX: Use defineChain directly.
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

class SomniaService {
  private sdk: SDK;
  private publicClient;
  private walletClient;
  // FIX: Use Address type directly.
  private publisherAddress: Address;
  // FIX: Use Hex type directly.
  private schemaId: Hex = NEXT_PUBLIC_CHAT_SCHEMA_ID as Hex;
  private encoder = new SchemaEncoder(CHAT_SCHEMA);
  private pollingInterval: number | null = null;
  private seenMessages: Set<string> = new Set();

  constructor() {
    // FIX: Use createPublicClient and http directly.
    this.publicClient = createPublicClient({
      chain: somniaTestnet,
      transport: http(RPC_URL),
    });

    // FIX: Use privateKeyToAccount from 'viem/accounts'. This resolves the error on this line.
    const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
    // FIX: Use createWalletClient and http directly.
    this.walletClient = createWalletClient({
      account,
      chain: somniaTestnet,
      transport: http(RPC_URL),
    });
    this.publisherAddress = account.address;

    this.sdk = new SDK({
      public: this.publicClient,
      wallet: this.walletClient,
    });
  }

  private async ensureSchemaRegistered(): Promise<void> {
    try {
        const isRegistered = await this.sdk.streams.isDataSchemaRegistered(this.schemaId);
        if (isRegistered) {
            console.log('Schema is already registered.');
            return;
        }

        console.log('Schema not registered. Registering...');
        const txHash = await this.sdk.streams.registerDataSchemas(
            [{ id: 'chat_app', schema: CHAT_SCHEMA, parentSchemaId: zeroBytes32 }],
            true // ignore if already registered
        );

        if (txHash) {
            // FIX: 'waitForTransactionReceipt' is a method on the publicClient, not a static function on 'viem'.
            // Also, cast txHash to Hex to fix the type error. This resolves the error on line 65 of the original file.
            await this.publicClient.waitForTransactionReceipt({ hash: txHash as Hex });
            console.log('Schema registered successfully.');
        }
    } catch (error) {
        if (error instanceof Error && error.message.includes('SchemaAlreadyRegistered')) {
            console.log('Schema registration confirmed (already exists).');
        } else {
            console.error('Failed to ensure schema registration:', error);
        }
    }
  }

  public async publishMessage(text: string, senderName: string): Promise<void> {
    await this.ensureSchemaRegistered();

    const now = Date.now();
    const roomId = 'general'; // Hardcoded for this app

    // FIX: Use Hex type directly.
    const payload: Hex = this.encoder.encodeData([
      { name: 'timestamp', value: now.toString(), type: 'uint64' },
      // FIX: Use toHex directly.
      { name: 'roomId', value: toHex(roomId, { size: 32 }), type: 'bytes32' },
      { name: 'content', value: text, type: 'string' },
      { name: 'senderName', value: senderName, type: 'string' },
      { name: 'sender', value: this.walletClient.account.address, type: 'address' },
    ]);

    const uniqueString = `${roomId}-${senderName}-${now}`;
    const dataId = keccak256(toHex(uniqueString));

    const tx = await this.sdk.streams.set([{ id: dataId, schemaId: this.schemaId, data: payload }]);

    if (!tx) {
      throw new Error('Failed to publish message.');
    }

    // FIX: The transaction hash from the SDK is a string, but waitForTransactionReceipt expects a Hex (`0x${string}`).
    // Casting `tx` to `Hex` resolves the type error.
    await this.publicClient.waitForTransactionReceipt({ hash: tx as Hex });
  }

  public subscribeToMessages(callback: MessageCallback, currentUser: string): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    this.seenMessages.clear(); // Clear seen messages for new subscription/user

    const poll = async () => {
      try {
        const allData = await this.sdk.streams.getAllPublisherDataForSchema(this.schemaId, this.publisherAddress);

        if (!Array.isArray(allData)) {
          return;
        }

        const newMessages: Message[] = [];
        
        const val = (field: any) => field?.value?.value ?? field?.value ?? '';

        for (const row of (allData as any[][])) {
            if (!Array.isArray(row) || row.length < 5) continue;
            
            const timestamp = Number(val(row[0]));
            const content = String(val(row[2]));
            const senderName = String(val(row[3]));

            const messageId = `${timestamp}-${senderName}-${content}`;

            if (this.seenMessages.has(messageId)) {
              continue;
            }
            this.seenMessages.add(messageId);

            newMessages.push({
              id: messageId,
              timestamp: timestamp,
              roomId: String(val(row[1])),
              text: content,
              senderName: senderName,
              senderAddress: String(val(row[4])),
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
    this.pollingInterval = window.setInterval(poll, 5000); // Poll every 5 seconds
  }

  public unsubscribe() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

const somniaService = new SomniaService();
export default somniaService;