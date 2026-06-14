import { ReducedValue, StateSchema } from "@langchain/langgraph";
import { z } from "zod";
import { incomingRequestSchema } from "schemas/incomingRequest";
import { requestAnalysisSchema } from "schemas/requestAnalysis";
import { llmClassificationSchema } from "schemas/llmClassification";
import { businessEvaluationSchema } from "schemas/businessEvaluation";
import { policyRouteSchema } from "schemas/policyRoute";
import { llmAutoReplySchema } from "schemas/llmAutoReply";
import { llmClarificationSchema } from "schemas/llmClarification";
import { humanReviewSourceSchema } from "schemas/humanReviewSource";
import { humanTicketSchema } from "schemas/humanTicket";
import { llmOperatorBriefSchema } from "schemas/llmOperatorBrief";
import { llmHumanSummarizeSchema } from "schemas/llmHumanSummarize";
import { finalRequestStatusSchema } from "schemas/finalRequestStatus";

const WorkflowState = new StateSchema({
  rawInput: new ReducedValue(z.unknown(), {
    reducer: (_, y) => y,
  }),
  requestId: new ReducedValue(z.string().nullable().default(null), {
    reducer: (_, y) => y,
  }),
  request: new ReducedValue(incomingRequestSchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  valid: new ReducedValue(z.boolean().default(false), {
    reducer: (_, y) => y,
  }),
  validationError: new ReducedValue(z.string().nullable().default(null), {
    reducer: (_, y) => y,
  }),
  analysis: new ReducedValue(requestAnalysisSchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  classification: new ReducedValue(llmClassificationSchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  business: new ReducedValue(businessEvaluationSchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  route: new ReducedValue(policyRouteSchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  autoReply: new ReducedValue(llmAutoReplySchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  clarificationReply: new ReducedValue(llmClarificationSchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  humanReviewSource: new ReducedValue(humanReviewSourceSchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  aiOperatorBrief: new ReducedValue(llmOperatorBriefSchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  humanTicket: new ReducedValue(humanTicketSchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  operatorReply: new ReducedValue(z.string().nullable().default(null), {
    reducer: (_, y) => y,
  }),
  summarizeReply: new ReducedValue(llmHumanSummarizeSchema.nullable().default(null), {
    reducer: (_, y) => y,
  }),
  finalRequestStatus: new ReducedValue(finalRequestStatusSchema.default("pending"), { reducer: (_, y) => y }),
});

export default WorkflowState;
