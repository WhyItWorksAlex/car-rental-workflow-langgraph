import { graph } from "graph/graph";
import { randomUUID } from "node:crypto";
import { Command, isInterrupted } from "@langchain/langgraph";
import { MOCK_OPERATOR_REPLY } from "const";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function buildInitialState(rawInput: unknown) {
  return {
    rawInput,
    requestId: null,
    request: null,
    valid: false,
    validationError: null,
    analysis: null,
    classification: null,
    business: null,
    route: null,
    autoReply: null,
    clarificationReply: null,
    humanReviewSource: null,
    aiOperatorBrief: null,
    humanTicket: null,
    operatorReply: null,
    summarizeReply: null,
    finalRequestStatus: "pending" as const,
  };
}

export async function runWorkflow(rawInput: unknown) {
  const thread_id = randomUUID();
  const config = { configurable: { thread_id } };

  let result = await graph.invoke(buildInitialState(rawInput), config);

  if (isInterrupted(result)) {
    console.log("\n[human] Workflow paused, waiting for operator...");
    await sleep(3000);
    console.log("[human] Employee submitted reply (mock):", MOCK_OPERATOR_REPLY);
    result = await graph.invoke(new Command({ resume: MOCK_OPERATOR_REPLY }), config);
  }

  return result;
}
