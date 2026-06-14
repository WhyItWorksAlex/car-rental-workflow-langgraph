import { z } from "zod";

export const finalRequestStatusSchema = z.enum(["pending", "fulfilled", "rejected"]);

export type FinalRequestStatus = z.infer<typeof finalRequestStatusSchema>;
