import { beforeEach, describe, expect, test } from "vitest";
import { seeker } from "../domain/testFixtures";
import {
  clearProfile,
  loadProfile,
  PROFILE_STORAGE_KEY,
  saveProfile,
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

  test("clears the stored profile", () => {
    saveProfile(seeker);
    clearProfile();

    expect(loadProfile()).toBeNull();
  });
});
