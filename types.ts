export type Role = 'user' | 'model';

export interface ChatMessage {
  role: Role;
  parts: { text: string }[];
}
