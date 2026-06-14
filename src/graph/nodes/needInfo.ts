import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { clarificationModel } from "../../llm/clarification";
import { CLARIFICATION_INSTRUCTIONS } from "../../config/clarificationInstructions";
import { buildSafeRequest } from "../../tools/buildSafeRequest";
import type WorkflowState from "../state";

type State = typeof WorkflowState.State;

export async function needInfoNode(state: State) {
  console.log("[need_info llm] Sending request to llm with requestId:", state.requestId);

  if (!state.request) {
    return { clarificationReply: null };
  }

  const { request, classification, analysis, requestId } = state;
  const { request: safeRequest, paymentCardProvided } = buildSafeRequest(request);

  const missingFieldIssues = analysis?.fieldIssues.filter((issue) => issue.kind === "missing");

  const needsBookingRef =
    (request.requestType === "cancel" || request.requestType === "modify_booking") &&
    request.bookingRef == null &&
    classification?.extractedBookingRef == null;

  const payload = {
    requestId,
    request: safeRequest,
    requestType: request.requestType,
    missingFieldIssues,
    needsBookingRef,
    paymentCardProvided,
    classification,
  };

  try {
    const clarificationReply = await clarificationModel.invoke([
      new SystemMessage(CLARIFICATION_INSTRUCTIONS),
      new HumanMessage(JSON.stringify(payload, null, 2)),
    ]);

    console.log("[need_info llm] reply: clientMessage:", clarificationReply.clientMessage);
    return { clarificationReply };
  } catch (error) {
    console.error("[need_info llm] LLM failed:", error);
    return {
      clarificationReply: null,
      humanReviewSource: "clarification_failed" as const,
    };
  }
}
