import type {
  DimensionScores,
  FounderProfile,
  ScoreBand,
} from "./types";

function clamp(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalized(values: string[]) {
  return new Set(values.map((value) => value.trim().toLowerCase()));
}

function coverage(needed: string[], offered: string[]) {
  if (needed.length === 0) return 100;
  const available = normalized(offered);
  const matches = needed.filter((value) =>
    available.has(value.trim().toLowerCase()),
  ).length;
  return (matches / needed.length) * 100;
}

function overlap(left: string[], right: string[]) {
  const leftValues = normalized(left);
  const rightValues = normalized(right);
  const union = new Set([...leftValues, ...rightValues]);
  if (union.size === 0) return 100;
  const shared = [...leftValues].filter((value) => rightValues.has(value));
  return (shared.length / union.size) * 100;
}

export function scoreProfiles(
  seeker: FounderProfile,
  candidate: FounderProfile,
): DimensionScores {
  const complementarity = clamp(
    (coverage(seeker.seeks, candidate.offers) +
      coverage(candidate.seeks, seeker.offers)) /
      2,
  );
  const values = clamp(overlap(seeker.values, candidate.values));
  const fundingAlignment =
    seeker.fundingPreference === "open" ||
    candidate.fundingPreference === "open" ||
    seeker.fundingPreference === candidate.fundingPreference
      ? 100
      : 0;
  const goals = clamp(
    overlap(seeker.industries, candidate.industries) * 0.7 +
      fundingAlignment * 0.3,
  );
  const workStyle = clamp(overlap(seeker.workStyle, candidate.workStyle));
  const timezoneScore = clamp(
    100 - Math.abs(seeker.timezone - candidate.timezone) * 12.5,
  );
  const commitmentScore =
    seeker.commitment === candidate.commitment
      ? 100
      : new Set([seeker.commitment, candidate.commitment]).has("exploring")
        ? 30
        : 70;
  const locationScore =
    seeker.remotePreference === "remote" &&
    candidate.remotePreference === "remote"
      ? 100
      : seeker.location.trim().toLowerCase() ===
          candidate.location.trim().toLowerCase()
        ? 100
        : 40;
  const logistics = clamp(
    timezoneScore * 0.5 + commitmentScore * 0.3 + locationScore * 0.2,
  );
  const overall = clamp(
    complementarity * 0.3 +
      values * 0.25 +
      goals * 0.2 +
      workStyle * 0.15 +
      logistics * 0.1,
  );

  return {
    complementarity,
    values,
    goals,
    workStyle,
    logistics,
    overall,
  };
}

export function scoreBand(score: number): ScoreBand {
  if (score >= 80) return "Strong fit";
  if (score >= 65) return "Promising fit";
  if (score >= 50) return "Worth exploring";
  return "Not recommended";
}
