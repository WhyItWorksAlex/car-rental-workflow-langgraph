import { createChatModel } from "./client";
import { llmHumanSummarizeSchema } from "../schemas/llmHumanSummarize";

export const humanSummarizeModel = createChatModel().withStructuredOutput(llmHumanSummarizeSchema, {
  name: "human_summarize",
  strict: true,
});
