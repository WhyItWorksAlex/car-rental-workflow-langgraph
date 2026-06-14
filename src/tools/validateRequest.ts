import { incomingRequestSchema } from "schemas/incomingRequest";

export function validateRequest(raw: unknown) {
  return incomingRequestSchema.safeParse(raw);
}
