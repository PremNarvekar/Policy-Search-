export interface Source {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  sources?: Source[];
  confidence?: number;
  responseTime?: number;
  retrievedDocuments?: number;
}

export interface ChatRequest {
  question: string;
  history?: Message[]; // For future use
}

export interface ChatResponse {
  question: string;
  answer: string;
  sources?: Source[];
  confidence?: number;
  responseTime?: number;
  retrievedDocuments?: number;
}
