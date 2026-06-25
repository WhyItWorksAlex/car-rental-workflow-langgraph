import { MemorySaver, StateGraph } from "@langchain/langgraph";
import WorkflowState from "./state";
import {
  addRequestIdNode,
  analyzeRequestNode,
  validateRequestNode,
  classifyRequestNode,
  policyRouterNode,
  autoReplyNode,
  needInfoNode,
  buildHumanTicketNode,
  humanReviewNode,
  humanAiSummaryNode,
  summarizeHumanReplyNode,
  sendClientNode,
  rejectRequestNode,
  saveHistoryNode,
} from "./nodes/indexNodes";

function afterValidate(state: typeof WorkflowState.State) {
  if (!state.valid) {
    console.log("[graph] validation failed → reject_request");
    return "reject_request";
  }
  console.log("[graph] validation ok → analyze");
  return "analyze";
}

function afterAutoReply(state: typeof WorkflowState.State) {
  if (state.autoReply == null) {
    console.log("[graph] auto_reply failed → human_deterministic");
    return "human_deterministic";
  }
  return "send_client";
}
function afterNeedInfo(state: typeof WorkflowState.State) {
  if (state.clarificationReply == null) {
    console.log("[graph] need_info failed → human_deterministic");
    return "human_deterministic";
  }
  return "send_client";
}

export const graph = new StateGraph(WorkflowState)
  .addNode("reqId", addRequestIdNode)
  .addNode("validate", validateRequestNode)
  .addNode("reject_request", rejectRequestNode)
  .addNode("analyze", analyzeRequestNode)
  .addNode("classify", classifyRequestNode)
  .addNode("policy", policyRouterNode)
  .addNode("auto_reply", autoReplyNode)
  .addNode("need_info", needInfoNode)
  .addNode("human_ai_summary", humanAiSummaryNode)
  .addNode("human_deterministic", buildHumanTicketNode)
  .addNode("human_review", humanReviewNode)
  .addNode("summarize_human_reply", summarizeHumanReplyNode)
  .addNode("send_client", sendClientNode)
  .addNode("save_history", saveHistoryNode)
  .addEdge("__start__", "reqId")
  .addEdge("reqId", "validate")
  .addConditionalEdges("validate", afterValidate)
  .addEdge("reject_request", "send_client")
  .addEdge("analyze", "classify")
  .addEdge("classify", "policy")
  .addConditionalEdges("policy", (state) => state.route ?? "reject_request")
  .addConditionalEdges("auto_reply", afterAutoReply)
  .addConditionalEdges("need_info", afterNeedInfo)
  .addEdge("human_ai_summary", "human_deterministic")
  .addEdge("human_deterministic", "human_review")
  .addEdge("human_review", "summarize_human_reply")
  .addEdge("summarize_human_reply", "send_client")
  .addEdge("send_client", "save_history")
  .addEdge("save_history", "__end__")
  .compile({ checkpointer: new MemorySaver() });
