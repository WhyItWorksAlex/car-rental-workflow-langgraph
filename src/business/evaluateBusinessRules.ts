import type { IncomingRequest } from "schemas/incomingRequest";
import type { BusinessEvaluation, BusinessIssue } from "schemas/businessEvaluation";
import { isAllowedCity } from "../business/isAllowedCity";
import { isDateInBookingWindow } from "../business/isDateInBookingWindow";
import { hasFreeSlots } from "../business/hasFreeSlots";
import { bookingRefExists } from "../business/bookingRefExists";

export function evaluateBusinessRules(request: IncomingRequest): BusinessEvaluation {
  const businessIssues: BusinessIssue[] = [];
  const { requestType } = request;

  if (requestType === "new_booking") {
    if (request.pickupCity != null && !isAllowedCity(request.pickupCity)) {
      businessIssues.push({
        field: "pickupCity",
        kind: "city_not_allowed",
        detail: request.pickupCity,
      });
    }

    if (request.pickupDateAndTime != null && !isDateInBookingWindow(request.pickupDateAndTime)) {
      businessIssues.push({ field: "pickupDateAndTime", kind: "date_out_of_window", detail: request.pickupDateAndTime });
    }

    if (request.returnDateAndTime != null && !isDateInBookingWindow(request.returnDateAndTime)) {
      businessIssues.push({ field: "returnDateAndTime", kind: "date_out_of_window", detail: request.returnDateAndTime });
    }

    if (
      request.carCategory != null &&
      request.pickupDateAndTime != null &&
      request.returnDateAndTime != null &&
      !hasFreeSlots(request.carCategory, request.pickupDateAndTime, request.returnDateAndTime)
    ) {
      businessIssues.push({ field: "carCategory", kind: "no_available_slot" });
    }
  }

  if (requestType === "cancel" && request.bookingRef != null) {
    if (!bookingRefExists(request.bookingRef)) {
      businessIssues.push({
        field: "bookingRef",
        kind: "booking_ref_not_found",
        detail: request.bookingRef,
      });
    }
  }

  // modify_booking — пока без бизнес-правил (всегда human)

  return { businessIssues };
}
