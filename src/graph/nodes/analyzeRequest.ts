import { analyzeRequest } from "../../tools/analyzeRequest";
import type WorkflowState from "../state";

type State = typeof WorkflowState.State;

export async function analyzeRequestNode(state: State) {
  console.log("[analyze] requestId:", state.requestId);

  if (!state.request) {
    console.log("[analyze] skipped: no request");
    return { analysis: null };
  }

  const analysis = analyzeRequest(state.request);

  console.log("[analyze] fieldIssues:", analysis.fieldIssues);
  return { analysis };
}
