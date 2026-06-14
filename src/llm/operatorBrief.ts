import { llmOperatorBriefSchema } from "schemas/llmOperatorBrief";
import { createChatModel } from "./client";

export const operatorBriefModel = createChatModel().withStructuredOutput(llmOperatorBriefSchema, {
  name: "operator_brief",
  strict: true,
});
