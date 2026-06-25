import { describe, expect, it } from "vitest";
import { validateRequest } from "../tools/validateRequest";
import { buildRequest } from "./fixtures";

describe("validateRequest", () => {
  it("accepts a well-formed request", () => {
    expect(validateRequest(buildRequest()).success).toBe(true);
  });

  it("rejects a malformed email address", () => {
    expect(validateRequest({ ...buildRequest(), customerEmail: "anna.klein.example.com" }).success).toBe(false);
  });

  it("rejects requestType values outside the allowed enum", () => {
    expect(validateRequest({ ...buildRequest(), requestType: "change_booking" }).success).toBe(false);
  });

  it("rejects a date without a time component", () => {
    expect(validateRequest({ ...buildRequest(), pickupDateAndTime: "2026-07-21" }).success).toBe(false);
  });

  it("rejects an unrecognised car category", () => {
    expect(validateRequest({ ...buildRequest(), carCategory: "sedan" }).success).toBe(false);
  });

  it("rejects a payment card with an invalid expiry month", () => {
    expect(
      validateRequest({
        ...buildRequest(),
        paymentCard: { cardNumber: "4111111111111111", expiryDate: "13/28", cvv: "123", cardholderName: "Test User" },
      }).success,
    ).toBe(false);
  });
});
