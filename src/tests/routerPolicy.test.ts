import { describe, expect, it } from "vitest";
import { evaluateBusinessRules } from "../business/evaluateBusinessRules";
import { routePolicy } from "../router/routerPolicy";
import { analyzeRequest } from "../tools/analyzeRequest";
import { buildClassification, buildRequest } from "./fixtures";

function route(request = buildRequest(), classification = buildClassification()) {
  const analysis = analyzeRequest(request);
  const business = evaluateBusinessRules(request);

  return routePolicy({
    request,
    analysis,
    business,
    classification: {
      ...classification,
      hasFieldProblems: analysis.fieldIssues.length > 0,
    },
  });
}

describe("routePolicy", () => {
  it("routes a clean new_booking to auto_reply", () => {
    expect(route()).toBe("auto_reply");
  });

  it("routes a new_booking with missing fields to need_info", () => {
    const request = buildRequest({ pickupCity: null });

    expect(route(request)).toBe("need_info");
  });

  it("routes low-confidence classification to human_ai_summary", () => {
    const classification = buildClassification({ confidence: "low" });

    expect(route(buildRequest(), classification)).toBe("human_ai_summary");
  });

  it("routes unclear bookingTypeIntension to human_ai_summary", () => {
    const classification = buildClassification({ bookingTypeIntension: "unclear" });

    expect(route(buildRequest(), classification)).toBe("human_ai_summary");
  });

  it("routes declared intent mismatch to human_ai_summary", () => {
    const request = buildRequest({
      requestType: "new_booking",
      additionalNotes: "Please cancel my booking AB-12345.",
    });
    const classification = buildClassification({
      bookingTypeIntension: "cancel",
      declaredIntentMatches: false,
      extractedBookingRef: "AB-12345",
    });

    expect(route(request, classification)).toBe("human_ai_summary");
  });

  it("routes modify_booking to human_ai_summary", () => {
    const request = buildRequest({
      requestType: "modify_booking",
      bookingRef: "AB-12345",
      paymentCard: null,
    });
    const classification = buildClassification({
      bookingTypeIntension: "modify_booking",
    });

    expect(route(request, classification)).toBe("human_ai_summary");
  });

  it("routes business rule violations to human_deterministic", () => {
    const request = buildRequest({ pickupCity: "Jerusalem" });
    const classification = buildClassification();

    expect(route(request, classification)).toBe("human_deterministic");
  });

  it("routes a cancel with valid bookingRef to auto_reply", () => {
    const request = buildRequest({
      requestType: "cancel",
      bookingRef: "AB-12345",
      pickupCity: null,
      pickupDateAndTime: null,
      returnDateAndTime: null,
      carCategory: null,
      paymentCard: null,
    });
    const classification = buildClassification({ bookingTypeIntension: "cancel" });

    expect(route(request, classification)).toBe("auto_reply");
  });

  it("routes a high-urgency request to human_ai_summary", () => {
    const classification = buildClassification({ urgency: "high" });

    expect(route(buildRequest(), classification)).toBe("human_ai_summary");
  });

  it("routes a request with additional requirements to human_ai_summary", () => {
    const classification = buildClassification({
      hasAdditionalRequirements: true,
      additions: "Child seat requested",
    });

    expect(route(buildRequest(), classification)).toBe("human_ai_summary");
  });
});
