import "dotenv/config";
import incomingRequests from "data/incomingRequests.json";
import { graph } from "graph/graph";
import { randomUUID } from "node:crypto";
import { Command, isInterrupted } from "@langchain/langgraph";
import { MOCK_OPERATOR_REPLY } from "const";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const rawInput = incomingRequests[Math.floor(Math.random() * incomingRequests.length)];

  console.log(`[start] running request`);
  const thread_id = randomUUID();

  const config = { configurable: { thread_id } };

  let result = await graph.invoke(
    {
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
      finalRequestStatus: "pending",
    },
    config,
  );

  if (isInterrupted(result)) {
    console.log("\n[human] Workflow paused, waiting for operator...");
    await sleep(3000); // imitation of human reply
    console.log("[human] Employee submitted reply (mock):", MOCK_OPERATOR_REPLY);
    result = await graph.invoke(new Command({ resume: MOCK_OPERATOR_REPLY }), config);
  }

  console.log("\n=== RESULT ===\n");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
