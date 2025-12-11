export interface QAEntry {
  question: string;
  answer: string | boolean | number | null;
}

export type ConversationResponse = QAEntry[];
