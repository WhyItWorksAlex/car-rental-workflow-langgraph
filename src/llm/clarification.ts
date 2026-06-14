import { createChatModel } from "./client";
import { llmClarificationSchema } from "schemas/llmClarification";

export const clarificationModel = createChatModel().withStructuredOutput(llmClarificationSchema, {
  name: "clarification",
  strict: true,
});
