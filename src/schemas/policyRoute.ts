import { z } from "zod";

export const policyRouteSchema = z.enum(["auto_reply", "need_info", "human_ai_summary", "human_deterministic"]);

export type PolicyRoute = z.infer<typeof policyRouteSchema>;
