import { useState } from "react";
import type { FounderProfile, MatchResult } from "../domain/types";

type ConnectPanelProps = {
  seeker: FounderProfile;
  match: MatchResult;
  onBack: () => void;
};

export function ConnectPanel({ seeker, match, onBack }: ConnectPanelProps) {
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState(
    `Hi ${match.profile.name.split(" ")[0]}, I’m ${seeker.name}. FoundPair highlighted the overlap between your ${match.profile.offers.slice(0, 2).join(" and ")} experience and the ${seeker.industries[0] ?? "company"} product I’m building. I’d love to compare what we each want from a cofounder relationship and see whether a short working session makes sense.`,
  );

  return (
    <main className="flow-page">
      <section className="connect-shell" aria-labelledby="connect-title">
        <button className="text-button" type="button" onClick={onBack}>
          ← Back to match
        </button>
        <p className="eyebrow">Make the first move</p>
        <h1 id="connect-title">Start with something specific.</h1>
        <p>
          We used only the evidence in both profiles. Edit this until it sounds
          like you.
        </p>
        <label>
          Your introduction
          <textarea
            rows={9}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSaved(false);
            }}
          />
        </label>
        <button className="button button-primary" type="button" onClick={() => setSaved(true)}>
          Save introduction
        </button>
        {saved ? (
          <p className="demo-confirmation" role="status">
            Saved for this demo — no message was sent.
          </p>
        ) : (
          <p className="privacy-note">This draft stays on this device.</p>
        )}
      </section>
    </main>
  );
}
