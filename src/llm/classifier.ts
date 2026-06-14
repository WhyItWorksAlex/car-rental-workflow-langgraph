import { createChatModel } from "./client";
import { llmClassificationSchema } from "schemas/llmClassification";

export const classifier = createChatModel().withStructuredOutput(llmClassificationSchema, {
  name: "classification",
  strict: true,
});
