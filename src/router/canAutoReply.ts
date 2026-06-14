import type { IncomingRequest } from "schemas/incomingRequest";
import type { RequestAnalysis } from "schemas/requestAnalysis";
import type { BusinessEvaluation } from "schemas/businessEvaluation";
import type { LlmClassification } from "schemas/llmClassification";
function baseAutoReplyReady(
  analysis: RequestAnalysis | null,
  business: BusinessEvaluation | null,
  classification: LlmClassification | null,
): boolean {
  if (!classification || !analysis) return false;
  if (analysis.fieldIssues.length > 0) return false;
  if (!business || business.businessIssues.length > 0) return false;
  if (classification.hasAdditionalRequirements) return false;
  if (classification.urgency !== "low") return false;
  return true;
}

export function canAutoReply(
  request: IncomingRequest,
  analysis: RequestAnalysis | null,
  business: BusinessEvaluation | null,
  classification: LlmClassification | null,
): boolean {
  if (request.requestType === "modify_booking") return false;

  if (!baseAutoReplyReady(analysis, business, classification)) return false;

  if (request.requestType === "new_booking") return true;

  if (request.requestType === "cancel") {
    return request.bookingRef != null;
  }
  return false;
}
