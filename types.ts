export interface Message {
  id: string;
  text: string;
  sender: 'self' | 'other';
  timestamp: number;
  senderName: string;
  senderAddress: string;
  roomId: string;
}