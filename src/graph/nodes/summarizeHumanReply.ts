import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { humanSummarizeModel } from "llm/humanSummarize";
import type WorkflowState from "../state";
import { HUMAN_SUMMARIZE_INSTRUCTIONS } from "config/humanSummarizeInstruction";

type State = typeof WorkflowState.State;

export async function summarizeHumanReplyNode(state: State) {
  if (!state.operatorReply) {
    console.log("[summarize_human_reply] no operatorReply");
    return { summarizeReply: null };
  }

  const payload = {
    operatorReply: state.operatorReply, // ← ГЛАВНЫЙ вход
    humanTicket: state.humanTicket,
  };

  try {
    const summarizeReply = await humanSummarizeModel.invoke([
      new SystemMessage(HUMAN_SUMMARIZE_INSTRUCTIONS),
      new HumanMessage(JSON.stringify(payload, null, 2)),
    ]);
    console.log("[summarize_human_reply] clientMessage:", summarizeReply.clientMessage);
    return { summarizeReply };
  } catch (error) {
    console.error("[summarize_human_reply] error:", error);
    return { summarizeReply: null };
  }
}
