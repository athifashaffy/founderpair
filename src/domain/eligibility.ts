import type {
  EligibilityReason,
  EligibilityResult,
  FounderProfile,
} from "./types";

function normalized(values: string[]) {
  return new Set(values.map((value) => value.trim().toLowerCase()));
}

function overlaps(left: string[], right: string[]) {
  const rightValues = normalized(right);
  return left.some((value) => rightValues.has(value.trim().toLowerCase()));
}

export function checkEligibility(
  seeker: FounderProfile,
  candidate: FounderProfile,
): EligibilityResult {
  const reasons: EligibilityReason[] = [];
  const commitmentPair = new Set([seeker.commitment, candidate.commitment]);
  if (commitmentPair.has("full-time") && commitmentPair.has("exploring")) {
    reasons.push("commitment");
  }

  const startIndex = { now: 0, quarter: 1, year: 2 } as const;
  if (
    Math.abs(startIndex[seeker.startWindow] - startIndex[candidate.startWindow]) >
    1
  ) {
    reasons.push("start-window");
  }

  const locationsDiffer =
    seeker.location.trim().toLowerCase() !==
    candidate.location.trim().toLowerCase();
  const requiresSharedLocation =
    seeker.remotePreference === "local" ||
    candidate.remotePreference === "local";
  if (
    (requiresSharedLocation && locationsDiffer) ||
    Math.abs(seeker.timezone - candidate.timezone) > 9
  ) {
    reasons.push("location");
  }

  if (!overlaps(seeker.seeks, candidate.offers)) {
    reasons.push("role-coverage");
  }

  if (
    seeker.fundingPreference !== "open" &&
    candidate.fundingPreference !== "open" &&
    seeker.fundingPreference !== candidate.fundingPreference
  ) {
    reasons.push("funding");
  }

  if (reasons.length > 0) {
    return { eligible: false, reasons };
  }

  return { eligible: true, reasons: [] };
}
