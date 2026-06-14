import { IncomingRequest, PaymentCard } from "schemas/incomingRequest";
import { FieldIssue, RequestAnalysis } from "../schemas/requestAnalysis";
import { BOOKING_REF_REGEX, requiredForNewBooking } from "../const";

function verifyPaymentCard(paymentCard: PaymentCard): boolean {
  // some algorithm for verifying payment card
  return true;
}

export function analyzeRequest(request: IncomingRequest): RequestAnalysis {
  const fieldIssues: FieldIssue[] = [];

  const { requestType } = request;

  if (request.paymentCard != null && !verifyPaymentCard(request.paymentCard)) {
    fieldIssues.push({ field: "paymentCard", kind: "invalid_payment_card" });
  }

  if (requestType === "modify_booking" || requestType === "cancel") {
    if (request.bookingRef == null) {
      fieldIssues.push({ field: "bookingRef", kind: "missing" });
    } else if (!BOOKING_REF_REGEX.test(request.bookingRef)) {
      fieldIssues.push({ field: "bookingRef", kind: "invalid_format" });
    }
  }

  if (requestType === "new_booking") {
    for (const field of requiredForNewBooking) {
      if (request[field] == null) {
        fieldIssues.push({ field, kind: "missing" });
      }
    }
    if (request.bookingRef != null) {
      fieldIssues.push({
        field: "bookingRef",
        kind: "unexpected_for_request_type",
        detail: "new_booking",
      });
    }
  }

  if (requestType == null) {
    fieldIssues.push({ field: "requestType", kind: "missing" });
  }

  if (
    request.pickupDateAndTime != null &&
    request.returnDateAndTime != null &&
    request.returnDateAndTime <= request.pickupDateAndTime
  ) {
    fieldIssues.push({
      field: "returnDateAndTime",
      kind: "invalid_date_range",
      detail: "return must be after pickup",
    });
  }

  return { fieldIssues };
}
