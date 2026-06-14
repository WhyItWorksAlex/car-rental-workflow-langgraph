import { z } from "zod";
export const businessIssueKindSchema = z.enum([
  "city_not_allowed",
  "date_out_of_window",
  "no_available_slot",
  "booking_ref_not_found",
]);
export const businessIssueSchema = z.object({
  field: z.string(),
  kind: businessIssueKindSchema,
  detail: z.string().optional(),
});
export const businessEvaluationSchema = z.object({
  businessIssues: z.array(businessIssueSchema),
});

export type BusinessIssueKind = z.infer<typeof businessIssueKindSchema>;
export type BusinessIssue = z.infer<typeof businessIssueSchema>;
export type BusinessEvaluation = z.infer<typeof businessEvaluationSchema>;
