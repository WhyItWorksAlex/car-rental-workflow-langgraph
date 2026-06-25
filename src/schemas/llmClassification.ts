import { z } from "zod";

export const llmClassificationSchema = z.object({
  urgency: z
    .enum(["low", "high"])
    .describe(
      "how urgent the request is. If URGENT, ASAP, repeated unanswered requests, tight deadlines, flight soon etc - set as high. Otherwise set as low.",
    ),
  additions: z
    .string()
    .describe("Briefly: additional requests - child seat, pick-up address, airport, etc. Empty line if there are none."),
  extractedBookingRef: z.string().nullable().describe("Extracted booking reference from additionalNotes if it exists."),
  summary: z.string().describe("Brief summary: request type, problems by fieldIssues, urgency, key wishes."),
  hasFieldProblems: z
    .boolean()
    .describe(
      "true if there are problems with fields according to fieldIssues (do not recalculate - only reflect the input analysis).",
    ),
  hasAdditionalRequirements: z.boolean().describe("true if additionalNotes contains wishes beyond the structured fields."),
  confidence: z
    .enum(["low", "high"])
    .describe(
      "how confident in your classification of the request. Low if we have a controversial text or your are not sure wether it is urgent or not.",
    ),
});

export type LlmClassification = z.infer<typeof llmClassificationSchema>;
