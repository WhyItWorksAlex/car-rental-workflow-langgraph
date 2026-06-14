import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { autoReplyModel } from "../../llm/autoReply";
import { AUTO_REPLY_INSTRUCTIONS } from "../../config/autoReplyInstructions";
import { buildSafeRequest } from "../../tools/buildSafeRequest";
import type WorkflowState from "../state";

type State = typeof WorkflowState.State;

export async function autoReplyNode(state: State) {
  console.log("[auto_reply llm] Sending request to llm with requestId:", state.requestId);

  if (!state.request) {
    return { autoReply: null };
  }

  const { request: safeRequest } = buildSafeRequest(state.request);

  const payload = {
    requestId: state.requestId,
    request: safeRequest,
    requestType: state.request.requestType,
    classification: state.classification,
  };

  try {
    const autoReply = await autoReplyModel.invoke([
      new SystemMessage(AUTO_REPLY_INSTRUCTIONS),
      new HumanMessage(JSON.stringify(payload, null, 2)),
    ]);

    console.log("[auto_reply llm] reply: clientMessage:", autoReply.clientMessage);
    return { autoReply };
  } catch (error) {
    console.error("[auto_reply llm] LLM failed:", error);
    return {
      autoReply: null,
      humanReviewSource: "auto_reply_failed" as const,
    };
  }
}
