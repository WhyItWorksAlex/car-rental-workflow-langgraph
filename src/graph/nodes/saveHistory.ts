import { saveRequestHistory } from "saveRequestHistory";
import type WorkflowState from "../state";

type State = typeof WorkflowState.State;

export async function saveHistoryNode(state: State) {
  await saveRequestHistory(state);
  return {};
}
