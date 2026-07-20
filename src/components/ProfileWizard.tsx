import { useEffect, useState } from "react";
import { structureProfileDraft, validateProfile } from "../domain/profile";
import type { FounderProfile } from "../domain/types";
import {
  clearProfileDraft,
  loadProfileDraft,
  saveProfileDraft,
  type ProfileDraft,
} from "../services/profileStorage";

type ProfileWizardProps = {
  initialProfile: FounderProfile | null;
  onCancel: () => void;
  onComplete: (profile: FounderProfile) => void;
};

function asList(value: string) {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

function browserTimezone() {
  return Math.max(-12, Math.min(14, -new Date().getTimezoneOffset() / 60));
}

function initialDraft(profile: FounderProfile | null): ProfileDraft {
  return {
    name: profile?.name ?? "",
    headline: profile?.headline ?? "",
    role: profile?.role ?? "Technical founder",
    location: profile?.location ?? "Toronto",
    timezone: profile?.timezone ?? browserTimezone(),
    remotePreference: profile?.remotePreference ?? "remote",
    bio: profile?.bio ?? "",
    offers: profile?.offers.join(", ") ?? "Engineering, Product",
    seeks: profile?.seeks.join(", ") ?? "Sales, Growth",
    industries: profile?.industries.join(", ") ?? "Climate, SaaS",
    values:
      profile?.values.join(", ") ??
      "Customer focus, Transparency, Ambition",
    workStyle:
      profile?.workStyle.join(", ") ?? "Async, Fast-paced, Data-informed",
    commitment: profile?.commitment ?? "full-time",
    startWindow: profile?.startWindow ?? "now",
    fundingPreference: profile?.fundingPreference ?? "venture",
  };
}

export function ProfileWizard({
  initialProfile,
  onCancel,
  onComplete,
}: ProfileWizardProps) {
  const [restoredDraft] = useState(() =>
    loadProfileDraft(),
  );
  const profileId = initialProfile?.id ?? "current-founder";
  const matchingDraft =
    restoredDraft?.profileId === profileId ? restoredDraft : null;
  const [step, setStep] = useState<1 | 2>(() => matchingDraft?.step ?? 1);
  const [draft, setDraft] = useState(() =>
    matchingDraft?.draft ?? initialDraft(initialProfile),
  );
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    saveProfileDraft({ version: 1, profileId, step, draft });
  }, [draft, profileId, step]);

  function update<Key extends keyof ProfileDraft>(
    key: Key,
    value: ProfileDraft[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function continueToMatchingDetails() {
    if (!draft.name.trim()) {
      setErrors(["Add your name to continue."]);
      return;
    }
    const structured = structureProfileDraft(draft.bio);
    setDraft((current) => ({
      ...current,
      offers:
        structured.offers?.length && current.offers === "Engineering, Product"
          ? structured.offers.join(", ")
          : current.offers,
      industries:
        structured.industries?.length && current.industries === "Climate, SaaS"
          ? structured.industries.join(", ")
          : current.industries,
      commitment: structured.commitment ?? current.commitment,
      fundingPreference:
        structured.fundingPreference ?? current.fundingPreference,
    }));
    setErrors([]);
    setStep(2);
  }

  function submitProfile(event: React.FormEvent) {
    event.preventDefault();
    const profile: FounderProfile = {
      id: initialProfile?.id ?? "current-founder",
      name: draft.name.trim(),
      headline: draft.headline.trim() || draft.role,
      role: draft.role,
      location: draft.location.trim() || "Toronto",
      timezone: draft.timezone,
      remotePreference: draft.remotePreference,
      commitment: draft.commitment,
      startWindow: draft.startWindow,
      offers: asList(draft.offers),
      seeks: asList(draft.seeks),
      industries: asList(draft.industries),
      values: asList(draft.values),
      workStyle: asList(draft.workStyle),
      fundingPreference: draft.fundingPreference,
      bio: draft.bio.trim(),
    };
    const issues = validateProfile(profile);
    if (issues.length > 0) {
      setErrors(issues.map((issue) => issue.message));
      return;
    }
    clearProfileDraft();
    onComplete(profile);
  }

  return (
    <main className="flow-page">
      <section className="wizard-shell" aria-labelledby="profile-title">
        <div className="wizard-progress" aria-label={`Step ${step} of 2`}>
          <span>Profile setup</span>
          <strong>{step}/2</strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: step === 1 ? "50%" : "100%" }} />
        </div>
        <h1 id="profile-title">
          {step === 1 ? "Start with your founder story." : "Define the fit."}
        </h1>
        <p>
          {step === 1
            ? "A few honest details make the recommendations more useful."
            : "Use comma-separated phrases. You can edit everything before matching."}
        </p>

        {errors.length > 0 ? (
          <div className="form-errors" role="alert">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="form-grid">
            <label>
              Your name
              <input
                autoComplete="name"
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Avery Chen"
              />
            </label>
            <label>
              Your founder role
              <select
                value={draft.role}
                onChange={(event) => update("role", event.target.value)}
              >
                <option>Technical founder</option>
                <option>Commercial founder</option>
                <option>Product founder</option>
                <option>Operations founder</option>
                <option>Design founder</option>
              </select>
            </label>
            <label>
              Location
              <input
                value={draft.location}
                onChange={(event) => update("location", event.target.value)}
              />
            </label>
            <label className="full-field">
              What do you want to build?
              <textarea
                value={draft.bio}
                onChange={(event) => update("bio", event.target.value)}
                placeholder="Full-time engineer building venture-backed climate software..."
                rows={5}
              />
              <small>
                FoundPair suggests structured attributes from this description;
                you confirm them next.
              </small>
            </label>
            <div className="form-actions full-field">
              <button className="button button-ghost" type="button" onClick={onCancel}>
                Back
              </button>
              <button className="button button-primary" type="button" onClick={continueToMatchingDetails}>
                Continue
              </button>
            </div>
          </div>
        ) : (
          <form className="form-grid" onSubmit={submitProfile}>
            <label>
              What do you bring?
              <input
                value={draft.offers}
                onChange={(event) => update("offers", event.target.value)}
              />
            </label>
            <label>
              What do you need?
              <input
                value={draft.seeks}
                onChange={(event) => update("seeks", event.target.value)}
              />
            </label>
            <label>
              Industries
              <input
                value={draft.industries}
                onChange={(event) => update("industries", event.target.value)}
              />
            </label>
            <label>
              Time zone (UTC offset)
              <input
                type="number"
                min="-12"
                max="14"
                step="0.5"
                value={draft.timezone}
                onChange={(event) =>
                  update("timezone", Number(event.target.value))
                }
              />
            </label>
            <label>
              Where can you work?
              <select
                value={draft.remotePreference}
                onChange={(event) =>
                  update(
                    "remotePreference",
                    event.target.value as FounderProfile["remotePreference"],
                  )
                }
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="local">Same location only</option>
              </select>
            </label>
            <label>
              Commitment
              <select
                value={draft.commitment}
                onChange={(event) =>
                  update(
                    "commitment",
                    event.target.value as FounderProfile["commitment"],
                  )
                }
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="exploring">Exploring</option>
              </select>
            </label>
            <label>
              Start timeline
              <select
                value={draft.startWindow}
                onChange={(event) =>
                  update(
                    "startWindow",
                    event.target.value as FounderProfile["startWindow"],
                  )
                }
              >
                <option value="now">Now</option>
                <option value="quarter">Within 3 months</option>
                <option value="year">Within a year</option>
              </select>
            </label>
            <label>
              Funding direction
              <select
                value={draft.fundingPreference}
                onChange={(event) =>
                  update(
                    "fundingPreference",
                    event.target.value as FounderProfile["fundingPreference"],
                  )
                }
              >
                <option value="venture">Venture-backed</option>
                <option value="bootstrapped">Bootstrapped</option>
                <option value="open">Open to either</option>
              </select>
            </label>
            <label className="full-field">
              Values
              <input
                value={draft.values}
                onChange={(event) => update("values", event.target.value)}
              />
            </label>
            <label className="full-field">
              Working style
              <input
                value={draft.workStyle}
                onChange={(event) => update("workStyle", event.target.value)}
              />
            </label>
            <div className="form-actions full-field">
              <button className="button button-ghost" type="button" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="button button-primary" type="submit">
                Show my matches
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
