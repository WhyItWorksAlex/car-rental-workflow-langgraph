import { z } from "zod";

export const llmOperatorBriefSchema = z.object({
  summary: z
    .string()
    .describe("2-5 sentences for the operator: request type, what the customer wants, and what action is needed."),
  keyConcerns: z
    .array(z.string())
    .describe(
      "Short labeled concern strings. Examples: 'Additional requirements present: child seat', 'Field issue: missing pickupCity', 'Business issue: city_not_allowed', 'High urgency', 'Complex case: ...'. Use only issues from the input payload.",
    ),
});

export type llmOperatorBrief = z.infer<typeof llmOperatorBriefSchema>;
