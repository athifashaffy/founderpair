import { describe, expect, test } from "vitest";
import { structureProfileDraft, validateProfile } from "./profile";

describe("structureProfileDraft", () => {
  test("extracts technical and venture signals from free text", () => {
    expect(
      structureProfileDraft(
        "Full-time engineer building a venture-backed climate product",
      ),
    ).toMatchObject({
      commitment: "full-time",
      fundingPreference: "venture",
      industries: ["Climate"],
      offers: ["Engineering", "Product"],
    });
  });

  test("does not invent fields from an empty description", () => {
    expect(structureProfileDraft("   ")).toEqual({});
  });
});

describe("validateProfile", () => {
  test("requires identity, role, skills, commitment, and logistics", () => {
    expect(validateProfile({}).map((issue) => issue.field)).toEqual([
      "name",
      "role",
      "offers",
      "seeks",
      "commitment",
      "timezone",
      "remotePreference",
    ]);
  });

  test("accepts the required profile fields", () => {
    expect(
      validateProfile({
        name: "Avery",
        role: "Technical founder",
        offers: ["Engineering"],
        seeks: ["Sales"],
        commitment: "full-time",
        timezone: -4,
        remotePreference: "remote",
      }),
    ).toEqual([]);
  });

  test("rejects an invalid UTC offset", () => {
    expect(
      validateProfile({
        name: "Avery",
        role: "Technical founder",
        offers: ["Engineering"],
        seeks: ["Sales"],
        commitment: "full-time",
        timezone: Number.NaN,
        remotePreference: "remote",
      }).map((issue) => issue.field),
    ).toContain("timezone");
  });
});
