export const BOOKING_REF_REGEX = /^[A-Za-z]{2}[-—]\d{5}$/;

export const requiredForNewBooking = [
  "pickupCity",
  "pickupDateAndTime",
  "returnDateAndTime",
  "carCategory",
  "paymentCard",
] as const;

export const ALLOWED_CITIES = ["Tel Aviv", "Haifa"] as const;

export const BOOKING_WINDOW = {
  from: "2026-07-01",
  to: "2026-07-31",
} as const;

export const MOCK_OPERATOR_REPLY = `I am a mock operator response. This text simulates what a human employee would write.

Please analyze all field issues, business issues, and system constraints from the ticket, then decide how to respond to the customer.

Guidelines for the final customer email:
- Child seats can be provided on request.
- If the city is not allowed, suggest Tel Aviv or Haifa.
- If dates are out of window or no slot is available, suggest alternative dates.
- If the car category has no availability, suggest another category.
- Modification requests should be treated as successfully processed.
- Cancellation requests should be treated as successfully processed when a valid booking reference is present.`;

export const FALLBACK_CLIENT_MESSAGE = "An error occurred. Please resubmit your request.";

export const VALIDATION_FAILED_MESSAGE = "The data in your request is incorrect. Please submit your request again.";
