import { z } from "zod";

export const llmAutoReplySchema = z.object({
  clientMessage: z
    .string()
    .describe("Short polite email to the customer. new_booking: confirm registration and welcome. cancel: confirm cancellation."),
});

export type LlmAutoReply = z.infer<typeof llmAutoReplySchema>;
