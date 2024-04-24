export interface ChatMessage {
  owner: string;
  text: string;
  timestamp: Date;
  isCopiedSuccess?: boolean;
}

export interface Conversations {
  [id: string]: {
    messages: ChatMessage[];
    name: string;
  };
}

export interface ConversationValues {
  messages: ChatMessage[];
  name: string;
}

export interface TransformedMessage {
  role: 'assistant' | 'user'; // Definimos los posibles valores para el campo 'role'
  content: string;
}

export interface AiChatResponse {
  message: string;
}