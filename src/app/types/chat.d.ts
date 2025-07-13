export type TChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TSendChatBody = {
  sessionId: string;
  messages: TChatMessage[];
  model?: string;
}