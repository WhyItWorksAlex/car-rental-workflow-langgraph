import { describe, expect, it } from "vitest";
import { stripTemplateMeta } from "loadRequestFile";

describe("stripTemplateMeta", () => {
  it("removes keys starting with underscore", () => {
    const input = {
      _fields: { customerEmail: "hint" },
      customerEmail: "anna@example.com",
      requestType: "new_booking",
    };

    expect(stripTemplateMeta(input)).toEqual({
      customerEmail: "anna@example.com",
      requestType: "new_booking",
    });
  });
});
