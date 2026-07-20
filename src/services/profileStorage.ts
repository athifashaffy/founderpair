import type { FounderProfile } from "../domain/types";

export const PROFILE_STORAGE_KEY = "foundpair.profile.v1";

function isFounderProfile(value: unknown): value is FounderProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<FounderProfile>;
  return (
    typeof profile.id === "string" &&
    typeof profile.name === "string" &&
    typeof profile.role === "string" &&
    Array.isArray(profile.offers) &&
    Array.isArray(profile.seeks) &&
    typeof profile.commitment === "string"
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

export function clearProfile(): void {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch {
    // There is nothing else to clear when browser storage is unavailable.
  }
}
