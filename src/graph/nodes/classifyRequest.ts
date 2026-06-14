import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { classifier } from "../../llm/classifier";
import { CLASSIFY_INSTRUCTIONS } from "../../config/classifyInstructions";
import type WorkflowState from "../state";
import { buildSafeRequest } from "../../tools/buildSafeRequest";

type State = typeof WorkflowState.State;

export async function classifyRequestNode(state: State) {
  console.log("[classify] requestId:", state.requestId);

  if (!state.request) {
    return { classification: null };
  }

  const { request, analysis, requestId } = state;
  const { request: safeRequest, paymentCardProvided } = buildSafeRequest(request);
  const payload = {
    requestId,
    request: safeRequest,
    analysis,
    paymentCardProvided,
  };

  try {
    const classification = await classifier.invoke([
      new SystemMessage(CLASSIFY_INSTRUCTIONS),
      new HumanMessage(JSON.stringify(payload, null, 2)),
    ]);

    console.log("[classify] result:", classification);
    return { classification };
  } catch (error) {
    console.error("[classify] error:", error);
    return { classification: null };
  }
}
