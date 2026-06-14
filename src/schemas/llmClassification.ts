import { z } from "zod";

export const llmClassificationSchema = z.object({
  urgency: z.enum(["low", "high"]),
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
});

export type LlmClassification = z.infer<typeof llmClassificationSchema>;
