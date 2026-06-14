import type { IncomingRequest } from "schemas/incomingRequest";
import type { RequestAnalysis } from "schemas/requestAnalysis";
import type { BusinessEvaluation } from "schemas/businessEvaluation";
import type { LlmClassification } from "schemas/llmClassification";
import type { PolicyRoute } from "schemas/policyRoute";
import { shouldNeedInfo } from "./shouldNeedInfo";
import { shouldHumanDeterministic } from "./shouldHumanDeterministic";
import { shouldHumanAiSummary } from "./shouldHumanAiSummary";
import { canAutoReply } from "./canAutoReply";

export type PolicyContext = {
  request: IncomingRequest;
  analysis: RequestAnalysis | null;
  business: BusinessEvaluation;
  classification: LlmClassification | null;
};

export function routePolicy(ctx: PolicyContext): PolicyRoute {
  const { request, analysis, business, classification } = ctx;

  if (!classification) {
    console.log("[policy router] human_ai_summary (no classification)");
    return "human_ai_summary";
  }

  if (shouldNeedInfo(request, analysis, classification)) {
    console.log("[policy router] need_info");
    return "need_info";
  }

  if (shouldHumanDeterministic(analysis, business, classification)) {
    console.log("[policy router] human_deterministic");
    return "human_deterministic";
  }

  if (shouldHumanAiSummary(request, analysis, classification)) {
    console.log("[policy router] human_ai_summary");
    return "human_ai_summary";
  }

  if (canAutoReply(request, analysis, business, classification)) {
    console.log("[policy router] auto_reply");
    return "auto_reply";
  }

  console.log("[policy router] human_ai_summary by default");
  return "human_ai_summary";
}
