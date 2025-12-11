import type { ConversationResponse } from '../types/conversation';

export async function fetchConversation(): Promise<ConversationResponse> {
  const response = await fetch('/api/conversation');

  if (!response.ok) {
    throw new Error(`Failed to fetch conversation: ${response.statusText}`);
  }

  return response.json();
}
