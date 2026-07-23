import { apiClient } from './axios';
import type { ChatRequest, ChatResponse } from '../types';

/**
 * Send a question to the PolicySearch RAG backend.
 * Only sends `question` — strips any client-only fields like `history`.
 */
export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  const { data } = await apiClient.post<ChatResponse>('/chat', {
    question: request.question,
  });
  return data;
};
