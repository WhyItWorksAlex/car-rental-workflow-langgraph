import { MOCK_OPERATOR_REPLY } from "const";
import type WorkflowState from "../state";
import { interrupt } from "@langchain/langgraph";

type State = typeof WorkflowState.State;

export async function humanReviewNode(state: State) {
  console.log("[human_review] source:", state.humanReviewSource);

  const reviewPackage = {
    humanReviewSource: state.humanReviewSource,
    humanTicket: state.humanTicket,
    ...(state.aiOperatorBrief != null ? { aiOperatorBrief: state.aiOperatorBrief } : {}),
  };

  if (state.aiOperatorBrief) {
    console.log("\n=== AI OPERATOR BRIEF ===\n");
    console.log(JSON.stringify(state.aiOperatorBrief, null, 2));
  }

  console.log("\n=== TICKET FOR EMPLOYEE ===\n");
  console.log(JSON.stringify(reviewPackage, null, 2));
  console.log("\n[human] Waiting for employee response...");
  const operatorReply = interrupt(reviewPackage);
  return { operatorReply };
}
