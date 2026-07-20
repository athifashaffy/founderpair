import type { FounderProfile, MatchResult } from "./types";
import { checkEligibility } from "./eligibility";
import { buildFallbackExplanation } from "./explanations";
import { scoreBand, scoreProfiles } from "./scoring";

export function rankCandidates(
  seeker: FounderProfile,
  candidates: FounderProfile[],
): MatchResult[] {
  return candidates
    .flatMap((profile): MatchResult[] => {
      if (!checkEligibility(seeker, profile).eligible) return [];
      const scores = scoreProfiles(seeker, profile);
      const band = scoreBand(scores.overall);
      if (band === "Not recommended") return [];

      return [
        {
          profile,
          scores,
          band,
          explanation: buildFallbackExplanation(seeker, profile, scores),
        },
      ];
    })
    .sort(
      (left, right) =>
        right.scores.overall - left.scores.overall ||
        right.scores.complementarity - left.scores.complementarity ||
        left.profile.id.localeCompare(right.profile.id),
    );
}
