import { buildSafeRequest } from "tools/buildSafeRequest";
import type { HumanTicket } from "schemas/humanTicket";
import WorkflowState from "graph/state";

type State = typeof WorkflowState.State;

export function buildHumanTicket(state: State): HumanTicket | null {
  const { requestId, request, analysis, classification, business } = state;

  if (!requestId || !request || !analysis || !classification || !business) {
    return null;
  }

  const { request: safeRequest, paymentCardProvided } = buildSafeRequest(request);

  return {
    requestId,
    request: safeRequest,
    paymentCardProvided,
    analysis,
    classification,
    business,
  };
}
