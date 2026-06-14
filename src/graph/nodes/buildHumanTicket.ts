import { buildHumanTicket } from "tools/buildHumanTicket";
import type WorkflowState from "../state";
import { HumanReviewSource } from "schemas/humanReviewSource";
import { HumanTicket } from "schemas/humanTicket";

type State = typeof WorkflowState.State;

export async function buildHumanTicketNode(state: State) {
  console.log("[build_human_ticket] requestId:", state.requestId);

  let humanReviewSource: HumanReviewSource | null = state.humanReviewSource;
  let humanTicket: HumanTicket | null = state.humanTicket;

  if (!state.humanReviewSource) {
    if (state.aiOperatorBrief) {
      console.log("[build_human_ticket] exists operator brief");
      humanReviewSource = "human_ai_summary";
    } else if (state.route === "human_ai_summary") {
      console.log("[build_human_ticket] llm for operator brief failed");
      humanReviewSource = "ai_operator_brief_failed";
    } else {
      console.log("[build_human_ticket] no operator brief");
      humanReviewSource = "human_deterministic";
    }
  }

  if (!humanTicket) {
    humanTicket = buildHumanTicket(state);
  }

  return { humanTicket, humanReviewSource };
}
