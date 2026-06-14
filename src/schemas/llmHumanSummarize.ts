// schemas/llmHumanSummarize.ts
import { z } from "zod";

export const llmHumanSummarizeSchema = z.object({
  clientMessage: z
    .string()
    .describe("Polite email to the customer. Based ONLY on operatorReply, with specifying main request details."),
});

export type LlmHumanSummarize = z.infer<typeof llmHumanSummarizeSchema>;
