import type { IncomingRequest } from "schemas/incomingRequest";
import type { RequestAnalysis } from "schemas/requestAnalysis";
import type { LlmClassification } from "schemas/llmClassification";

export function shouldHumanAiSummary(
  request: IncomingRequest,
  analysis: RequestAnalysis | null,
  classification: LlmClassification,
): boolean {
  if (request.requestType === "modify_booking" || classification.urgency === "high" || classification.hasAdditionalRequirements)
    return true;

  if (analysis?.fieldIssues.some((i) => i.kind === "unexpected_for_request_type")) {
    return true;
  }

  if (request.requestType === "cancel" && request.bookingRef == null && classification.extractedBookingRef != null) {
    return true;
  }

  return false;
}
