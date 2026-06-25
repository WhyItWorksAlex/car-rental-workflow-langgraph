import type { IncomingRequest } from "../schemas/incomingRequest";
import type { LlmClassification } from "../schemas/llmClassification";

const defaultPaymentCard = {
  cardNumber: "4111111111111111",
  expiryDate: "06/28",
  cvv: "123",
  cardholderName: "Test User",
} as const;

export function buildRequest(overrides: Partial<IncomingRequest> = {}): IncomingRequest {
  return {
    customerEmail: "test@example.com",
    requestType: "new_booking",
    bookingRef: null,
    pickupCity: "Tel Aviv",
    pickupDateAndTime: "2026-07-10T09:00:00Z",
    returnDateAndTime: "2026-07-12T18:00:00Z",
    carCategory: "economy",
    paymentCard: { ...defaultPaymentCard },
    additionalNotes: "",
    ...overrides,
  };
}

export function buildClassification(overrides: Partial<LlmClassification> = {}): LlmClassification {
  return {
    urgency: "low",
    additions: "",
    extractedBookingRef: null,
    bookingTypeIntension: "new_booking",
    declaredIntentMatches: true,
    summary: "Clean new booking request.",
    hasFieldProblems: false,
    hasAdditionalRequirements: false,
    confidence: "high",
    ...overrides,
  };
}
