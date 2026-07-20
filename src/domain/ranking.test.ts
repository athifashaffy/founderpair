import { describe, expect, test } from "vitest";
import { candidates } from "../data/candidates";
import { rankCandidates } from "./ranking";
import { candidate, seeker } from "./testFixtures";

describe("rankCandidates", () => {
  test("filters hard conflicts before returning ranked matches", () => {
    const eligible = { ...candidate, id: "eligible-low" };
    const excluded = {
      ...candidate,
      id: "excluded-high",
      commitment: "exploring" as const,
    };

    expect(
      rankCandidates(seeker, [eligible, excluded]).map(
        (match) => match.profile.id,
      ),
    ).toEqual(["eligible-low"]);
  });

  test("uses stable id to break otherwise identical ties", () => {
    const tied = [
      { ...candidate, id: "candidate-b" },
      { ...candidate, id: "candidate-a" },
    ];

    expect(
      rankCandidates(seeker, tied).map((match) => match.profile.id),
    ).toEqual(["candidate-a", "candidate-b"]);
  });

  test("returns at least three demo matches for the default profile", () => {
    const results = rankCandidates(seeker, candidates);

    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results.every((match) => match.scores.overall >= 50)).toBe(true);
  });
});
