import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { buildSafeRequest } from "tools/buildSafeRequest";
import { operatorBriefModel } from "../../llm/operatorBrief";
import { OPERATOR_BRIEF_INSTRUCTIONS } from "../../config/operatorBriefInstructions";
import type WorkflowState from "../state";

type State = typeof WorkflowState.State;

export async function humanAiSummaryNode(state: State) {
  console.log("[human_ai_summary] requestId:", state.requestId);

  if (!state.request) {
    return { aiOperatorBrief: null };
  }

  const { request: safeRequest, paymentCardProvided } = buildSafeRequest(state.request);

  const payload = {
    requestId: state.requestId,
    request: safeRequest,
    paymentCardProvided,
    analysis: state.analysis,
    classification: state.classification,
    business: state.business,
  };

  try {
    const aiOperatorBrief = await operatorBriefModel.invoke([
      new SystemMessage(OPERATOR_BRIEF_INSTRUCTIONS),
      new HumanMessage(JSON.stringify(payload, null, 2)),
    ]);

    console.log("[human_ai_summary] summary:", aiOperatorBrief.summary);
    console.log("[human_ai_summary] keyConcerns:", aiOperatorBrief.keyConcerns);

    return { aiOperatorBrief };
  } catch (error) {
    console.error("[human_ai_summary] LLM failed:", error);
    return {
      aiOperatorBrief: null,
    };
  }
}
