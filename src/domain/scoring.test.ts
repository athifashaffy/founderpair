import { describe, expect, test } from "vitest";
import { scoreBand, scoreProfiles } from "./scoring";
import { candidate, seeker } from "./testFixtures";

describe("scoreProfiles", () => {
  test("applies the documented weights", () => {
    const scores = scoreProfiles(seeker, candidate);

    expect(scores.overall).toBe(
      Math.round(
        scores.complementarity * 0.3 +
          scores.values * 0.25 +
          scores.goals * 0.2 +
          scores.workStyle * 0.15 +
          scores.logistics * 0.1,
      ),
    );
  });

  test("rewards bidirectional skill coverage", () => {
    expect(scoreProfiles(seeker, candidate).complementarity).toBe(100);
    expect(
      scoreProfiles(seeker, {
        ...candidate,
        offers: ["Sales"],
        seeks: ["Design"],
      }).complementarity,
    ).toBeLessThan(100);
  });

  test("keeps every score bounded", () => {
    const scores = scoreProfiles(seeker, candidate);

    for (const score of Object.values(scores)) {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });
});

describe("scoreBand", () => {
  test.each([
    [80, "Strong fit"],
    [65, "Promising fit"],
    [50, "Worth exploring"],
    [49, "Not recommended"],
  ] as const)("maps %i to %s", (score, band) => {
    expect(scoreBand(score)).toBe(band);
  });
});
