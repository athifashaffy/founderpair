import { describe, expect, test, vi } from "vitest";
import { scoreProfiles } from "../domain/scoring";
import { candidate, seeker } from "../domain/testFixtures";
import type { MatchExplanation } from "../domain/types";
import { getMatchExplanation } from "./explanationClient";

const fallback: MatchExplanation = {
  summary: "Fallback summary",
  strengths: ["Grounded strength one", "Grounded strength two"],
  friction: "Fallback friction",
  questions: ["Question one?", "Question two?", "Question three?"],
};

const input = {
  seeker,
  candidate,
  scores: scoreProfiles(seeker, candidate),
};

describe("getMatchExplanation", () => {
  test("returns the deterministic fallback when the endpoint fails", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("offline"));

    await expect(
      getMatchExplanation(input, fallback, fetcher),
    ).resolves.toEqual(fallback);
  });

  test("rejects an incomplete endpoint payload and uses fallback", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ summary: "Unsupported" }), { status: 200 }),
    );

    await expect(
      getMatchExplanation(input, fallback, fetcher),
    ).resolves.toEqual(fallback);
  });

  test("uses a complete structured explanation", async () => {
    const generated: MatchExplanation = {
      summary: "Maya's Sales experience complements Avery's Engineering.",
      strengths: [
        "Maya brings Sales while Avery brings Engineering.",
        "Both founders value Transparency.",
      ],
      friction: "Compare planning styles in a short working session.",
      questions: [
        "Who owns customer discovery?",
        "How will decisions be made?",
        "What changes your commitment?",
      ],
    };
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(generated), { status: 200 }),
      );

    await expect(
      getMatchExplanation(input, fallback, fetcher),
    ).resolves.toEqual(generated);
  });
});
