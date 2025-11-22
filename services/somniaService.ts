import { Hex } from 'viem';
import { API_BASE_URL } from '../constants';
import { Message } from '../types';

type MessageCallback = (messages: Message[]) => void;

// ============================================================================
// SOMNIA SERVICE - HTTP CLIENT FOR DATA STREAMS
// ============================================================================
// This service provides a simple HTTP client interface for interacting with
// Somnia Data Streams (SDS) via the backend API.
//
// IMPORTANT: This is a frontend-only service. It does NOT import or use
// @somnia-chain/streams directly. All blockchain operations are handled
// server-side for security (private key management).
//
// The frontend communicates with the backend via REST API endpoints:
// - POST /api/streams/register-schema - Register a schema on-chain
// - POST /api/streams/publish-message - Publish a message
// - GET /api/streams/messages/:roomId - Retrieve messages
//
// This architecture ensures:
// 1. Private keys never leave the server
// 2. Browser clients don't need to handle blockchain complexity
// 3. Server can implement rate limiting, validation, and caching
// ============================================================================

export class SomniaService {
  private baseUrl: string;
  private pollingInterval: number | null = null;
  private seenMessages: Set<string> = new Set();

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Register a chat schema on-chain via the backend
   * @param schemaId - The schema ID to register
   * @param roomName - The room name
   * @param roomId - The room ID
   * @returns The transaction hash if registration was performed, null if already registered
   */
  public async registerChatSchema(
    schemaId: Hex,
    roomName: string,
    roomId: string
  ): Promise<Hex | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/streams/register-schema`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName, roomId, schemaId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.alreadyRegistered) {
        console.log('Schema is already registered.');
        return null;
      }

      console.log('Schema registered successfully.');
      return data.txHash as Hex | null;
    } catch (error) {
      console.error('Failed to register schema:', error);
      throw error;
    }
  }

  /**
   * Publish a message to a room via the backend
   * @param text - The message text
   * @param senderName - The sender's display name
   * @param senderAddress - The sender's wallet address
   * @param roomId - The room ID
   * @param schemaId - The schema ID to use
   * @returns The transaction hash
   */
  public async publishMessage(
    text: string,
    senderName: string,
    senderAddress: string,
    roomId: string,
    schemaId: Hex
  ): Promise<Hex> {
    try {
      const response = await fetch(`${this.baseUrl}/api/streams/publish-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, senderName, senderAddress, roomId, schemaId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.txHash as Hex;
    } catch (error) {
      console.error('Failed to publish message:', error);
      throw error;
    }
  }

  /**
   * Subscribe to new messages in a room with polling
   * @param callback - Function to call when new messages arrive
   * @param schemaId - The schema ID to monitor
   * @param roomId - The room ID to filter by
   * @param currentUserAddress - The current user's wallet address for sender attribution
   * @param pollIntervalMs - Polling interval in milliseconds (default: 5000)
   */
  public subscribeToMessages(
    callback: MessageCallback,
    schemaId: Hex,
    roomId: string,
    currentUserAddress: string,
    pollIntervalMs: number = 5000
  ): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    this.seenMessages.clear();

    const poll = async () => {
      try {
        const response = await fetch(
          `${this.baseUrl}/api/streams/messages/${encodeURIComponent(roomId)}?schemaId=${schemaId}`
        );

        if (!response.ok) {
          console.error(`Failed to fetch messages: ${response.status}`);
          return;
        }

        const messages: Message[] = await response.json();

        if (!Array.isArray(messages)) {
          return;
        }

        const newMessages: Message[] = [];

        for (const message of messages) {
          if (this.seenMessages.has(message.id)) {
            continue;
          }
          this.seenMessages.add(message.id);

          // Set sender type based on address comparison
          const sender = message.senderAddress.toLowerCase() === currentUserAddress.toLowerCase() 
            ? 'self' 
            : 'other';

          newMessages.push({
            ...message,
            sender,
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
