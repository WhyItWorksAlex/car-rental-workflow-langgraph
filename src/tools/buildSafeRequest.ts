import type { IncomingRequest } from "schemas/incomingRequest";

export function buildSafeRequest(request: IncomingRequest) {
  const { paymentCard, ...safeRequest } = request;

  return {
    request: safeRequest,
    paymentCardProvided: paymentCard != null,
  };
}
