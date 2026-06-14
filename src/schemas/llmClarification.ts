import { z } from "zod";

export const llmClarificationSchema = z.object({
  clientMessage: z.string().describe("Polite email asking the customer to provide missing information. English, 3–6 sentences."),
});

export type LlmClarification = z.infer<typeof llmClarificationSchema>;
