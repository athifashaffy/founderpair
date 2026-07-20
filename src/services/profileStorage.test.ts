import { beforeEach, describe, expect, test, vi } from "vitest";
import { seeker } from "../domain/testFixtures";
import {
  clearIntroduction,
  clearProfile,
  clearProfileDraft,
  loadIntroduction,
  loadProfile,
  loadProfileDraft,
  PROFILE_STORAGE_KEY,
  saveIntroduction,
  saveProfile,
  saveProfileDraft,
} from "./profileStorage";

describe("profileStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("round-trips a profile through local storage", () => {
    saveProfile(seeker);

    expect(loadProfile()).toEqual(seeker);
  });

  test("returns null for malformed stored data", () => {
    localStorage.setItem(PROFILE_STORAGE_KEY, "not-json");

    expect(loadProfile()).toBeNull();
  });

  test("rejects a structurally incomplete stored profile", () => {
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        ...seeker,
        industries: undefined,
      }),
    );

    expect(loadProfile()).toBeNull();
  });

  test("round-trips and clears a saved introduction", () => {
    expect(saveIntroduction("candidate", "Hello Maya")).toBe(true);

    expect(loadIntroduction("candidate")).toBe("Hello Maya");
    clearIntroduction("candidate");
    expect(loadIntroduction("candidate")).toBeNull();
  });

  test("round-trips and clears an in-progress profile draft", () => {
    const draft = {
      version: 1 as const,
      step: 2 as const,
      profileId: "current-founder",
      draft: {
        name: "Avery",
        headline: "",
        role: "Technical founder",
        location: "Toronto",
        timezone: -4,
        remotePreference: "remote" as const,
        bio: "Building climate software",
        offers: "Engineering",
        seeks: "Sales",
        industries: "Climate",
        values: "Transparency",
        workStyle: "Async",
        commitment: "full-time" as const,
        startWindow: "now" as const,
        fundingPreference: "venture" as const,
      },
    };

    saveProfileDraft(draft);
    expect(loadProfileDraft()).toEqual(draft);
    clearProfileDraft();
    expect(loadProfileDraft()).toBeNull();
  });

  test("reports when an introduction cannot be persisted", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("blocked", "SecurityError");
      });

    expect(saveIntroduction("candidate", "Hello Maya")).toBe(false);
    setItem.mockRestore();
  });

  test("clears the stored profile", () => {
    saveProfile(seeker);
    clearProfile();

    expect(loadProfile()).toBeNull();
  });
});
