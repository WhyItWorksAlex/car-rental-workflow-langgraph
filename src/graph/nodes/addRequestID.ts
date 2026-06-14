import { randomUUID } from "node:crypto";
import type WorkflowState from "../state";

type State = typeof WorkflowState.State;

export async function addRequestIdNode(state: State) {
  console.log("[addRequestId] assigning requestId");
  return {
    requestId: randomUUID(),
  };
}
