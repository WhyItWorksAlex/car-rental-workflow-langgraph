import { createChatModel } from "./client";
import { llmAutoReplySchema } from "../schemas/llmAutoReply";

export const autoReplyModel = createChatModel().withStructuredOutput(llmAutoReplySchema, {
  name: "auto_reply",
  strict: true,
});
