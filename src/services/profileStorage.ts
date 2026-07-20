import type { FounderProfile } from "../domain/types";

export const PROFILE_STORAGE_KEY = "foundpair.profile.v1";
export const PROFILE_DRAFT_STORAGE_KEY = "foundpair.profile-draft.v1";
const INTRODUCTION_STORAGE_PREFIX = "foundpair.introduction.v1.";

export type ProfileDraft = {
  name: string;
  headline: string;
  role: string;
  location: string;
  timezone: number;
  remotePreference: FounderProfile["remotePreference"];
  bio: string;
  offers: string;
  seeks: string;
  industries: string;
  values: string;
  workStyle: string;
  commitment: FounderProfile["commitment"];
  startWindow: FounderProfile["startWindow"];
  fundingPreference: FounderProfile["fundingPreference"];
};

export type StoredProfileDraft = {
  version: 1;
  step: 1 | 2;
  draft: ProfileDraft;
};

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isOneOf<Value extends string>(
  value: unknown,
  options: readonly Value[],
): value is Value {
  return typeof value === "string" && options.includes(value as Value);
}

function isFounderProfile(value: unknown): value is FounderProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<FounderProfile>;
  return (
    typeof profile.id === "string" &&
    typeof profile.name === "string" &&
    typeof profile.headline === "string" &&
    typeof profile.role === "string" &&
    typeof profile.location === "string" &&
    typeof profile.timezone === "number" &&
    Number.isFinite(profile.timezone) &&
    isOneOf(profile.remotePreference, ["remote", "hybrid", "local"] as const) &&
    isOneOf(profile.commitment, ["exploring", "part-time", "full-time"] as const) &&
    isOneOf(profile.startWindow, ["now", "quarter", "year"] as const) &&
    isStringList(profile.offers) &&
    isStringList(profile.seeks) &&
    isStringList(profile.industries) &&
    isStringList(profile.values) &&
    isStringList(profile.workStyle) &&
    isOneOf(profile.fundingPreference, ["bootstrapped", "venture", "open"] as const) &&
    typeof profile.bio === "string"
  );
}

function isProfileDraft(value: unknown): value is ProfileDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<ProfileDraft>;
  const stringFields: Array<keyof ProfileDraft> = [
    "name", "headline", "role", "location", "bio", "offers", "seeks",
    "industries", "values", "workStyle",
  ];
  return (
    stringFields.every((field) => typeof draft[field] === "string") &&
    typeof draft.timezone === "number" &&
    Number.isFinite(draft.timezone) &&
    isOneOf(draft.remotePreference, ["remote", "hybrid", "local"] as const) &&
    isOneOf(draft.commitment, ["exploring", "part-time", "full-time"] as const) &&
    isOneOf(draft.startWindow, ["now", "quarter", "year"] as const) &&
    isOneOf(draft.fundingPreference, ["bootstrapped", "venture", "open"] as const)
  );
}

export function loadProfile(): FounderProfile | null {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isFounderProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: FounderProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Matching still works when storage is blocked or full.
  }
}

export function loadProfileDraft(): StoredProfileDraft | null {
  try {
    const stored = localStorage.getItem(PROFILE_DRAFT_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return null;
    const value = parsed as Partial<StoredProfileDraft>;
    return value.version === 1 &&
      (value.step === 1 || value.step === 2) &&
      isProfileDraft(value.draft)
      ? (value as StoredProfileDraft)
      : null;
  } catch {
    return null;
  }
}

export function saveProfileDraft(value: StoredProfileDraft): void {
  try {
    localStorage.setItem(PROFILE_DRAFT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // The form remains usable when storage is blocked or full.
  }
}

export function clearProfileDraft(): void {
  try {
    localStorage.removeItem(PROFILE_DRAFT_STORAGE_KEY);
  } catch {
    // There is nothing else to clear when browser storage is unavailable.
  }
}

export function loadIntroduction(matchId: string): string | null {
  try {
    const stored = localStorage.getItem(`${INTRODUCTION_STORAGE_PREFIX}${matchId}`);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return null;
    const value = parsed as { version?: unknown; message?: unknown };
    return value.version === 1 && typeof value.message === "string"
      ? value.message
      : null;
  } catch {
    return null;
  }
}

export function saveIntroduction(matchId: string, message: string): void {
  try {
    localStorage.setItem(
      `${INTRODUCTION_STORAGE_PREFIX}${matchId}`,
      JSON.stringify({ version: 1, message }),
    );
  } catch {
    // The draft remains editable when storage is blocked or full.
  }
}

export function clearIntroduction(matchId: string): void {
  try {
    localStorage.removeItem(`${INTRODUCTION_STORAGE_PREFIX}${matchId}`);
  } catch {
    // There is nothing else to clear when browser storage is unavailable.
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch {
    // There is nothing else to clear when browser storage is unavailable.
  }
}
