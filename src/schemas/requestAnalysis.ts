import { z } from "zod";
export const fieldIssueKindSchema = z.enum([
  "missing",
  "invalid_format",
  "not_allowed",
  "unexpected_for_request_type",
  "invalid_payment_card",
  "invalid_date_range",
]);
export const fieldIssueSchema = z.object({
  field: z.string(),
  kind: fieldIssueKindSchema,
  detail: z.string().optional(),
});
export const requestAnalysisSchema = z.object({
  fieldIssues: z.array(fieldIssueSchema),
});

export type FieldIssueKind = z.infer<typeof fieldIssueKindSchema>;
export type FieldIssue = z.infer<typeof fieldIssueSchema>;
export type RequestAnalysis = z.infer<typeof requestAnalysisSchema>;
