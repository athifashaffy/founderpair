import { describe, expect, test } from "vitest";
import { buildFallbackExplanation } from "./explanations";
import { scoreProfiles } from "./scoring";
import { candidate, seeker } from "./testFixtures";

describe("buildFallbackExplanation", () => {
  test("grounds the explanation in profile evidence", () => {
    const explanation = buildFallbackExplanation(
      seeker,
      candidate,
      scoreProfiles(seeker, candidate),
    );

    expect(explanation.strengths.length).toBeGreaterThanOrEqual(2);
    expect(explanation.friction).toBeTruthy();
    expect(explanation.questions).toHaveLength(3);
    expect(JSON.stringify(explanation)).toContain(candidate.offers[0]);
  });
});
