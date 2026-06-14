import { z } from "zod";
import { incomingRequestSchema } from "./incomingRequest";
import { requestAnalysisSchema } from "./requestAnalysis";
import { llmClassificationSchema } from "./llmClassification";
import { businessEvaluationSchema } from "./businessEvaluation";

export const humanTicketSchema = z.object({
  requestId: z.string(),
  request: incomingRequestSchema.omit({ paymentCard: true }),
  paymentCardProvided: z.boolean(),
  analysis: requestAnalysisSchema,
  classification: llmClassificationSchema,
  business: businessEvaluationSchema,
});

export type HumanTicket = z.infer<typeof humanTicketSchema>;
