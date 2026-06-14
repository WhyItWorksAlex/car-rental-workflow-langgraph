import type { IncomingRequest } from "schemas/incomingRequest";
import type { RequestAnalysis } from "schemas/requestAnalysis";
import type { LlmClassification } from "schemas/llmClassification";

export function shouldNeedInfo(
  request: IncomingRequest,
  analysis: RequestAnalysis | null,
  classification: LlmClassification,
): boolean {
  if (classification.hasAdditionalRequirements || classification.urgency === "high") {
    return false;
  }

  if (
    (request.requestType === "cancel" || request.requestType === "modify_booking") &&
    request.bookingRef == null &&
    classification.extractedBookingRef == null
  ) {
    return true;
  }

  if (!analysis) return true;

  for (const issue of analysis.fieldIssues) {
    if (issue.kind !== "missing") continue;
    if (issue.field === "bookingRef" && classification.extractedBookingRef != null) {
      continue;
    }
    return true;
  }

  return false;
}
