export interface QAEntry {
  question: string;
  answer: string | boolean;
}

export type ConversationResponse = QAEntry[];
