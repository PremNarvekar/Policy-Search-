import { useMutation } from '@tanstack/react-query';
import { sendChatMessage } from '../api/chat';
import type { ChatRequest, ChatResponse } from '../types';

export const useChat = () => {
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: (request) => sendChatMessage(request),
    // You can add global error handling or logging here if needed
  });
};
