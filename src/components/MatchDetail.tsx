import type { MatchResult } from "../domain/types";

type MatchDetailProps = {
  match: MatchResult;
  onBack: () => void;
  onConnect: () => void;
};

export function MatchDetail({ match, onBack, onConnect }: MatchDetailProps) {
  return (
    <main className="flow-page">
      <article className="detail-shell">
        <button className="text-button" type="button" onClick={onBack}>
          ← Back to matches
        </button>
        <header className="detail-hero">
          <div className="avatar avatar-large" aria-hidden="true">
            {match.profile.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <p className="eyebrow">{match.band} · {match.scores.overall}/100</p>
            <h1>{match.profile.name}</h1>
            <p>{match.profile.headline}</p>
          </div>
          <button className="button button-primary" type="button" onClick={onConnect}>
            Create an intro
          </button>
        </header>

        <p className="detail-summary">{match.explanation.summary}</p>

        <div className="detail-grid">
          <section className="detail-panel detail-panel-lime">
            <p className="eyebrow">Strengths</p>
            <h2>What could click</h2>
            <ul>
              {match.explanation.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel detail-panel-coral">
            <p className="eyebrow">Potential friction</p>
            <h2>Worth discussing</h2>
            <p>{match.explanation.friction}</p>
          </section>
        </div>

        <section className="questions-panel">
          <p className="eyebrow">First conversation</p>
          <h2>Skip the small talk.</h2>
          <ol>
            {match.explanation.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </section>
      </article>
    </main>
  );
}
