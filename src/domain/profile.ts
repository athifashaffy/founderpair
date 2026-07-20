import type { FounderProfile } from "./types";

export type ProfileField =
  | "name"
  | "role"
  | "offers"
  | "seeks"
  | "commitment"
  | "timezone"
  | "remotePreference";

export type ValidationIssue = {
  field: ProfileField;
  message: string;
};

export function structureProfileDraft(
  text: string,
): Partial<FounderProfile> {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return {};

  const draft: Partial<FounderProfile> = {};
  if (/\bfull[ -]?time\b/.test(normalized)) {
    draft.commitment = "full-time";
  } else if (/\bpart[ -]?time\b/.test(normalized)) {
    draft.commitment = "part-time";
  } else if (/\bexplor(e|ing|atory)\b/.test(normalized)) {
    draft.commitment = "exploring";
  }

  if (/\b(venture|vc|venture-backed)\b/.test(normalized)) {
    draft.fundingPreference = "venture";
  } else if (/\b(bootstrap|bootstrapped)\b/.test(normalized)) {
    draft.fundingPreference = "bootstrapped";
  }

  const industrySignals = [
    ["Climate", /\b(climate|energy|sustainability)\b/],
    ["Health", /\b(health|healthcare|medical)\b/],
    ["Fintech", /\b(fintech|financial)\b/],
    ["Education", /\b(education|edtech|learning)\b/],
    ["SaaS", /\bsaas\b/],
    ["Consumer", /\bconsumer\b/],
  ] as const;
  const industries = industrySignals
    .filter(([, pattern]) => pattern.test(normalized))
    .map(([industry]) => industry);
  if (industries.length > 0) draft.industries = industries;

  const skillSignals = [
    ["Engineering", /\b(engineer|engineering|developer|technical)\b/],
    ["Product", /\b(product|product management)\b/],
    ["Design", /\b(design|designer|ux|ui)\b/],
    ["Sales", /\b(sales|selling|revenue)\b/],
    ["Growth", /\b(growth|marketing)\b/],
    ["Operations", /\b(operations|operator)\b/],
  ] as const;
  const offers = skillSignals
    .filter(([, pattern]) => pattern.test(normalized))
    .map(([skill]) => skill);
  if (offers.length > 0) draft.offers = offers;

  return draft;
}

export function validateProfile(
  profile: Partial<FounderProfile>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!profile.name?.trim()) {
    issues.push({ field: "name", message: "Add your name." });
  }
  if (!profile.role?.trim()) {
    issues.push({ field: "role", message: "Choose the role you bring." });
  }
  if (!profile.offers?.length) {
    issues.push({ field: "offers", message: "Choose at least one strength." });
  }
  if (!profile.seeks?.length) {
    issues.push({ field: "seeks", message: "Choose at least one skill you need." });
  }
  if (!profile.commitment) {
    issues.push({ field: "commitment", message: "Choose your commitment level." });
  }
  if (
    typeof profile.timezone !== "number" ||
    !Number.isFinite(profile.timezone) ||
    profile.timezone < -12 ||
    profile.timezone > 14
  ) {
    issues.push({
      field: "timezone",
      message: "Add a UTC offset between -12 and +14.",
    });
  }
  if (!profile.remotePreference) {
    issues.push({
      field: "remotePreference",
      message: "Choose where you can work with a cofounder.",
    });
  }
  return issues;
}
