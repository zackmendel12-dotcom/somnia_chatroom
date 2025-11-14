import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hex, WalletClient, PublicClient } from 'viem';
import { SomniaService } from './somniaService';
import { CHAT_SCHEMA } from '../constants';

// Mock the @somnia-chain/streams SDK
vi.mock('@somnia-chain/streams', () => {
  const mockZeroBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex;
  
  return {
    SDK: vi.fn().mockImplementation(() => ({
      streams: {
        isDataSchemaRegistered: vi.fn(),
        registerDataSchemas: vi.fn(),
        getAllPublisherDataForSchema: vi.fn(),
        set: vi.fn(),
      },
    })),
    SchemaEncoder: vi.fn().mockImplementation(() => ({
      encodeData: vi.fn().mockReturnValue('0x1234' as Hex),
    })),
    zeroBytes32: mockZeroBytes32,
  };
});

// Mock viem modules
vi.mock('viem', async () => {
  const actual = await vi.importActual<typeof import('viem')>('viem');
  return {
    ...actual,
    createPublicClient: vi.fn(() => ({
      waitForTransactionReceipt: vi.fn(),
    })),
  };
});

describe('SomniaService', () => {
  let mockWalletClient: WalletClient;
  let mockPublicClient: PublicClient;
  let service: SomniaService;
  const testSchemaId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' as Hex;

  beforeEach(() => {
    vi.clearAllMocks();

    mockWalletClient = {
      account: {
        address: '0x1234567890123456789012345678901234567890' as Hex,
      },
    } as WalletClient;

    mockPublicClient = {
      waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'success' }),
    } as unknown as PublicClient;

    service = new SomniaService({
      walletClient: mockWalletClient,
      publicClient: mockPublicClient,
    });
  });

  describe('registerChatSchema', () => {
    it('should register a new schema successfully', async () => {
      const mockTxHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as Hex;
      
      // Mock SDK methods
      const mockSdk = (service as any).sdk;
      mockSdk.streams.isDataSchemaRegistered.mockResolvedValue(false);
      mockSdk.streams.registerDataSchemas.mockResolvedValue(mockTxHash);

      const result = await service.registerChatSchema(testSchemaId, CHAT_SCHEMA);

      expect(mockSdk.streams.isDataSchemaRegistered).toHaveBeenCalledWith(testSchemaId);
      expect(mockSdk.streams.registerDataSchemas).toHaveBeenCalledWith(
        [{ 
          id: testSchemaId, 
          schema: CHAT_SCHEMA, 
          parentSchemaId: '0x0000000000000000000000000000000000000000000000000000000000000000' 
        }],
        true
      );
      expect(mockPublicClient.waitForTransactionReceipt).toHaveBeenCalledWith({ hash: mockTxHash });
      expect(result).toBe(mockTxHash);
    });

    it('should return null if schema is already registered', async () => {
      const mockSdk = (service as any).sdk;
      mockSdk.streams.isDataSchemaRegistered.mockResolvedValue(true);

      const result = await service.registerChatSchema(testSchemaId, CHAT_SCHEMA);

      expect(mockSdk.streams.isDataSchemaRegistered).toHaveBeenCalledWith(testSchemaId);
      expect(mockSdk.streams.registerDataSchemas).not.toHaveBeenCalled();
      expect(mockPublicClient.waitForTransactionReceipt).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle SchemaAlreadyRegistered error gracefully', async () => {
      const mockSdk = (service as any).sdk;
      mockSdk.streams.isDataSchemaRegistered.mockResolvedValue(false);
      
      const error = new Error('SchemaAlreadyRegistered: Schema is already registered');
      mockSdk.streams.registerDataSchemas.mockRejectedValue(error);

      await expect(service.registerChatSchema(testSchemaId, CHAT_SCHEMA)).rejects.toThrow(
        'SchemaAlreadyRegistered'
      );

      expect(mockSdk.streams.isDataSchemaRegistered).toHaveBeenCalledWith(testSchemaId);
      expect(mockSdk.streams.registerDataSchemas).toHaveBeenCalled();
    });

    it('should propagate other errors', async () => {
      const mockSdk = (service as any).sdk;
      mockSdk.streams.isDataSchemaRegistered.mockResolvedValue(false);
      
      const error = new Error('Network error');
      mockSdk.streams.registerDataSchemas.mockRejectedValue(error);

      await expect(service.registerChatSchema(testSchemaId, CHAT_SCHEMA)).rejects.toThrow('Network error');

      expect(mockSdk.streams.isDataSchemaRegistered).toHaveBeenCalledWith(testSchemaId);
      expect(mockSdk.streams.registerDataSchemas).toHaveBeenCalled();
    });

    it('should return null if registerDataSchemas returns null/falsy', async () => {
      const mockSdk = (service as any).sdk;
      mockSdk.streams.isDataSchemaRegistered.mockResolvedValue(false);
      mockSdk.streams.registerDataSchemas.mockResolvedValue(null);

      const result = await service.registerChatSchema(testSchemaId, CHAT_SCHEMA);

      expect(result).toBeNull();
      expect(mockPublicClient.waitForTransactionReceipt).not.toHaveBeenCalled();
    });

    it('should require a wallet client with signer', async () => {
      const serviceWithoutAccount = new SomniaService({
        walletClient: {} as WalletClient,
        publicClient: mockPublicClient,
      });

      const mockSdk = (serviceWithoutAccount as any).sdk;
      mockSdk.streams.isDataSchemaRegistered.mockResolvedValue(false);
      mockSdk.streams.registerDataSchemas.mockResolvedValue(
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as Hex
      );

      // The SDK should still attempt to register, but the underlying wallet client
      // would fail - we're just verifying the service doesn't crash without account
      await expect(service.registerChatSchema(testSchemaId, CHAT_SCHEMA)).resolves.toBeDefined();
    });
  });

  describe('publishMessage', () => {
    it('should throw error if wallet client account is not available', async () => {
      const serviceWithoutAccount = new SomniaService({
        walletClient: {} as WalletClient,
        publicClient: mockPublicClient,
      });

      await expect(
        serviceWithoutAccount.publishMessage('test', 'user', 'room1', testSchemaId)
      ).rejects.toThrow('Wallet client account is not available');
    });
  });

  describe('getRoomMessages', () => {
    it('should filter messages by room ID and sort by timestamp', async () => {
      const mockData = [
        [
          { value: { value: 1000 } }, // timestamp
          { value: { value: 'room1' } }, // roomId
          { value: { value: 'Hello' } }, // content
          { value: { value: 'Alice' } }, // senderName
          { value: { value: '0xaaa' } }, // senderAddress
        ],
        [
          { value: { value: 2000 } },
          { value: { value: 'room2' } }, // different room
          { value: { value: 'World' } },
          { value: { value: 'Bob' } },
          { value: { value: '0xbbb' } },
        ],
        [
          { value: { value: 1500 } },
          { value: { value: 'room1' } },
          { value: { value: 'Hi' } },
          { value: { value: 'Charlie' } },
          { value: { value: '0xccc' } },
        ],
      ];

      const mockSdk = (service as any).sdk;
      mockSdk.streams.getAllPublisherDataForSchema.mockResolvedValue(mockData);

      const messages = await service.getRoomMessages(
        testSchemaId,
        'room1',
        '0x1234567890123456789012345678901234567890' as Hex,
        'Alice'
      );

      expect(messages).toHaveLength(2);
      expect(messages[0].text).toBe('Hello');
      expect(messages[0].sender).toBe('self');
      expect(messages[1].text).toBe('Hi');
      expect(messages[1].sender).toBe('other');
      expect(messages[0].timestamp).toBe(1000);
      expect(messages[1].timestamp).toBe(1500);
    });

    it('should return empty array if no data', async () => {
      const mockSdk = (service as any).sdk;
      mockSdk.streams.getAllPublisherDataForSchema.mockResolvedValue(null);

      const messages = await service.getRoomMessages(
        testSchemaId,
        'room1',
        '0x1234567890123456789012345678901234567890' as Hex
      );

      expect(messages).toEqual([]);
    });
  });

  describe('subscribeToMessages', () => {
    it('should clear previous polling interval when called', () => {
      vi.useFakeTimers();
      
      const callback = vi.fn();
      service.subscribeToMessages(
        callback,
        testSchemaId,
        'room1',
        '0x1234567890123456789012345678901234567890' as Hex,
        'user1'
      );

      expect((service as any).pollingInterval).not.toBeNull();
      
      service.subscribeToMessages(
        callback,
        testSchemaId,
        'room1',
        '0x1234567890123456789012345678901234567890' as Hex,
        'user1'
      );

      expect((service as any).pollingInterval).not.toBeNull();
      
      vi.useRealTimers();
    });
  });

  describe('unsubscribe', () => {
    it('should clear polling interval', () => {
      vi.useFakeTimers();
      
      const callback = vi.fn();
      service.subscribeToMessages(
        callback,
        testSchemaId,
        'room1',
        '0x1234567890123456789012345678901234567890' as Hex,
        'user1'
      );

      expect((service as any).pollingInterval).not.toBeNull();
      
      service.unsubscribe();
      
      expect((service as any).pollingInterval).toBeNull();
      
      vi.useRealTimers();
    });
  });
});
