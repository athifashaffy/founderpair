import { describe, expect, test } from "vitest";
import { checkEligibility } from "./eligibility";
import { candidate, seeker } from "./testFixtures";

describe("checkEligibility", () => {
  test("excludes incompatible commitment", () => {
    expect(
      checkEligibility(seeker, { ...candidate, commitment: "exploring" }),
    ).toEqual({ eligible: false, reasons: ["commitment"] });
  });

  test("excludes a start window that is too far apart", () => {
    expect(
      checkEligibility(seeker, { ...candidate, startWindow: "year" }),
    ).toEqual({ eligible: false, reasons: ["start-window"] });
  });

  test("excludes profiles without a required skill", () => {
    expect(
      checkEligibility(seeker, {
        ...candidate,
        offers: ["Operations"],
      }),
    ).toEqual({ eligible: false, reasons: ["role-coverage"] });
  });

  test("excludes a candidate whose required skill the seeker cannot cover", () => {
    expect(
      checkEligibility(seeker, {
        ...candidate,
        seeks: ["Operations"],
      }),
    ).toEqual({ eligible: false, reasons: ["role-coverage"] });
  });

  test("collects each hard conflict in stable order", () => {
    expect(
      checkEligibility(seeker, {
        ...candidate,
        commitment: "exploring",
        startWindow: "year",
        offers: ["Operations"],
        fundingPreference: "bootstrapped",
      }),
    ).toEqual({
      eligible: false,
      reasons: ["commitment", "start-window", "role-coverage", "funding"],
    });
  });

  test("keeps compatible profiles", () => {
    expect(checkEligibility(seeker, candidate)).toEqual({
      eligible: true,
      reasons: [],
    });
  });
});
