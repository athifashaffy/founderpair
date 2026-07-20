import type {
  DimensionScores,
  FounderProfile,
  MatchExplanation,
} from "./types";

function intersection(left: string[], right: string[]) {
  const rightValues = new Set(
    right.map((value) => value.trim().toLowerCase()),
  );
  return left.filter((value) => rightValues.has(value.trim().toLowerCase()));
}

function list(values: string[]) {
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

export function buildFallbackExplanation(
  seeker: FounderProfile,
  candidate: FounderProfile,
  scores: DimensionScores,
): MatchExplanation {
  const offeredCoverage = intersection(candidate.offers, seeker.seeks);
  const sharedValues = intersection(seeker.values, candidate.values);
  const sharedIndustries = intersection(seeker.industries, candidate.industries);
  const sharedWorkStyle = intersection(seeker.workStyle, candidate.workStyle);
  const strengths: string[] = [];

  if (offeredCoverage.length > 0) {
    strengths.push(
      `${candidate.name} brings ${list(offeredCoverage)}, directly covering capabilities you want beside you.`,
    );
  }
  if (sharedValues.length > 0) {
    strengths.push(
      `You both prioritize ${list(sharedValues.slice(0, 2))}, giving early decisions a shared foundation.`,
    );
  }
  if (sharedIndustries.length > 0) {
    strengths.push(
      `You share interest in ${list(sharedIndustries)}, while approaching it from ${seeker.role.toLowerCase()} and ${candidate.role.toLowerCase()} perspectives.`,
    );
  }
  if (strengths.length < 2 && sharedWorkStyle.length > 0) {
    strengths.push(
      `Your preferred working rhythm overlaps around ${list(sharedWorkStyle.slice(0, 2))}.`,
    );
  }
  if (strengths.length < 2) {
    strengths.push(
      `${candidate.name}'s ${candidate.role.toLowerCase()} background adds a different operating lens to your ${seeker.role.toLowerCase()} strengths.`,
    );
  }

  const lowest = (
    [
      ["complementarity", scores.complementarity],
      ["values", scores.values],
      ["goals", scores.goals],
      ["workStyle", scores.workStyle],
      ["logistics", scores.logistics],
    ] as const
  ).sort((left, right) => left[1] - right[1])[0]?.[0];

  const frictionByDimension = {
    complementarity: `Your skill coverage is promising but incomplete; compare ownership boundaries for ${list(seeker.seeks)} before choosing roles.`,
    values: `Your profiles name different top values; trade examples of how each of you handles a difficult company decision.`,
    goals: `Your domain or funding preferences only partly overlap; agree on the first customer and financing path before committing.`,
    workStyle: `Your preferred working rhythms differ in places; test a one-week project and compare communication expectations.`,
    logistics: `Your availability or location needs coordination; agree on overlap hours and the timeline for increasing commitment.`,
  } as const;

  return {
    summary: `${candidate.name} looks worth a conversation because ${candidate.offers[0]} complements your profile and the pair scores ${scores.overall}/100 across the full compatibility model.`,
    strengths: strengths.slice(0, 3),
    friction: frictionByDimension[lowest ?? "goals"],
    questions: [
      `Which decisions should the ${seeker.role.toLowerCase()} and ${candidate.role.toLowerCase()} each own in the first 90 days?`,
      `How would you test demand in ${sharedIndustries[0] ?? candidate.industries[0] ?? "your target market"} before building deeply?`,
      `What would make each of you increase—or reduce—your current ${candidate.commitment} commitment?`,
    ],
  };
}
