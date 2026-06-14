// schemas/humanReviewSource.ts
import { z } from "zod";

export const humanReviewSourceSchema = z.enum([
  "human_deterministic", // основной путь: rule violation
  "human_ai_summary", // основной путь: сложный кейс
  "auto_reply_failed", // fallback: LLM auto_reply упал
  "clarification_failed", // fallback: LLM need_info упал
  "ai_operator_brief_failed", // fallback: LLM operatorBrief упал
]);

export type HumanReviewSource = z.infer<typeof humanReviewSourceSchema>;
