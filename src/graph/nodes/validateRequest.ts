import { validateRequest } from "../../tools/validateRequest";
import type WorkflowState from "../state";

type State = typeof WorkflowState.State;

export async function validateRequestNode(state: State) {
  console.log("[validateRequest] checking input, requestId:", state.requestId);

  const result = validateRequest(state.rawInput);

  if (!result.success) {
    console.log("[validateRequest] failed:", result.error.message);
    return {
      valid: false,
      request: null,
      validationError: result.error.message,
    };
  }

  console.log("[validate] ok");
  return {
    valid: true,
    request: result.data,
    validationError: null,
  };
}
