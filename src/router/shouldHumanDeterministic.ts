import type { BusinessEvaluation } from "schemas/businessEvaluation";
import { LlmClassification } from "schemas/llmClassification";
import type { RequestAnalysis } from "schemas/requestAnalysis";

export function shouldHumanDeterministic(
  analysis: RequestAnalysis | null,
  business: BusinessEvaluation | null,
  classification: LlmClassification,
): boolean {
  if (business && business.businessIssues.length > 0) return true;

  for (const issue of analysis?.fieldIssues ?? []) {
    if (issue.kind === "missing") continue;
    return true;
  }

  return false;
}
