import type WorkflowState from "graph/state";
import { FALLBACK_CLIENT_MESSAGE } from "../const";

type State = typeof WorkflowState.State;

export function resolveClientMessage(state: State): string {
  return (
    state.autoReply?.clientMessage ??
    state.clarificationReply?.clientMessage ??
    state.summarizeReply?.clientMessage ??
    FALLBACK_CLIENT_MESSAGE
  );
}
