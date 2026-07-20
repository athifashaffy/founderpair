import type { FounderProfile, MatchResult } from "../domain/types";

type MatchResultsProps = {
  seeker: FounderProfile;
  matches: MatchResult[];
  onEdit: () => void;
  onSelect: (match: MatchResult) => void;
};

export function MatchResults({
  seeker,
  matches,
  onEdit,
  onSelect,
}: MatchResultsProps) {
  return (
    <main className="flow-page">
      <section className="results-shell" aria-labelledby="matches-title">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Matched for {seeker.name}</p>
            <h1 id="matches-title">Your strongest matches.</h1>
            <p>
              Ranked for complementary skills, shared expectations, and the
              practical details that shape a partnership.
            </p>
          </div>
          <button className="button button-ghost" type="button" onClick={onEdit}>
            Edit profile
          </button>
        </div>

        {matches.length === 0 ? (
          <div className="empty-state">
            <p className="eyebrow">No eligible matches yet</p>
            <h2>Your constraints are doing their job.</h2>
            <p>
              Try changing one constraint—commitment, start timeline, or the
              skills you need—rather than ignoring a dealbreaker.
            </p>
            <button className="button button-primary" type="button" onClick={onEdit}>
              Review constraints
            </button>
          </div>
        ) : (
          <div className="match-grid">
            {matches.slice(0, 6).map((match, index) => (
              <article className="match-card" key={match.profile.id}>
                <div className="match-card-topline">
                  <span className="match-rank">0{index + 1}</span>
                  <span className={`score-pill score-${match.band.toLowerCase().replaceAll(" ", "-")}`}>
                    {match.band}
                  </span>
                </div>
                <div className="avatar" aria-hidden="true">
                  {match.profile.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <h2>{match.profile.name}</h2>
                <p className="match-role">{match.profile.headline}</p>
                <p className="match-meta">
                  {match.profile.location} · UTC{match.profile.timezone >= 0 ? "+" : ""}
                  {match.profile.timezone} · {match.profile.commitment}
                </p>
                <div className="skill-list" aria-label="Top skills">
                  {match.profile.offers.slice(0, 3).map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <p className="match-summary">{match.explanation.summary}</p>
                <details className="score-details">
                  <summary>Scoring details</summary>
                  <dl>
                    <div><dt>Overall</dt><dd>{match.scores.overall}</dd></div>
                    <div><dt>Skill coverage</dt><dd>{match.scores.complementarity}</dd></div>
                    <div><dt>Values</dt><dd>{match.scores.values}</dd></div>
                  </dl>
                </details>
                <button className="button button-dark" type="button" onClick={() => onSelect(match)}>
                  View match <span aria-hidden="true">↗</span>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
