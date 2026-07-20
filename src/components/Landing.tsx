type LandingProps = {
  onStart: () => void;
  onDemo: () => void;
};

export function Landing({ onStart, onDemo }: LandingProps) {
  return (
    <main className="landing">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Explainable matching for serious founders</p>
          <h1 id="hero-title">
            Find the cofounder who <em>completes</em> the picture.
          </h1>
          <p className="hero-lede">
            Find skills that complement yours, values that align, and working
            expectations that hold up after the first coffee.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={onStart}>
              Find my cofounder <span aria-hidden="true">↗</span>
            </button>
            <button className="button button-ghost" type="button" onClick={onDemo}>
              Try the demo profile
            </button>
          </div>
          <ul className="trust-list" aria-label="FoundPair principles">
            <li><span aria-hidden="true">✓</span> No unexplained scores</li>
            <li><span aria-hidden="true">✓</span> Dealbreakers first</li>
            <li><span aria-hidden="true">✓</span> No signup for the demo</li>
          </ul>
        </div>

        <div className="hero-product" aria-label="FoundPair match preview">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <article className="preview-card preview-card-main">
            <div className="preview-topline">
              <span className="mini-logo">FP</span>
              <span className="score-pill">Strong fit</span>
            </div>
            <div className="preview-person">
              <div className="avatar avatar-preview" aria-hidden="true">MB</div>
              <div>
                <p className="preview-kicker">Your #1 match</p>
                <h2>Maya Brooks</h2>
                <p>Go-to-market builder · New York</p>
              </div>
            </div>
            <div className="preview-score-row">
              <div className="score-ring"><strong>88</strong><span>overall</span></div>
              <div className="preview-bars">
                <div><span>Skill coverage</span><i style={{ width: "94%" }} /></div>
                <div><span>Values</span><i style={{ width: "86%" }} /></div>
                <div><span>Working style</span><i style={{ width: "78%" }} /></div>
              </div>
            </div>
            <p className="preview-reason">
              <strong>Why it works:</strong> Maya brings Sales and Growth while
              sharing your customer-first, fast-moving approach.
            </p>
          </article>
          <aside className="floating-note floating-note-top">
            <span className="note-icon">↔</span>
            <p><strong>Complementary by design</strong><br />Different strengths, shared direction</p>
          </aside>
          <aside className="floating-note floating-note-bottom">
            <span className="note-icon note-icon-coral">?</span>
            <p><strong>Worth discussing</strong><br />Surface friction before it grows</p>
          </aside>
        </div>
      </section>

      <section className="promise-strip" aria-label="The FoundPair matching loop">
        <p>Skills that complement</p><span>+</span>
        <p>Values that align</p><span>+</span>
        <p>Reasons you can trust</p>
      </section>

      <section className="how-section" id="how-it-works" aria-labelledby="how-title">
        <div className="section-heading">
          <p className="eyebrow">A better first introduction</p>
          <h2 id="how-title">Reasons, not roulette.</h2>
          <p>
            FoundPair keeps the loop deliberately focused: say what you bring,
            define what matters, and explore the people who genuinely fit.
          </p>
        </div>
        <ol className="step-grid">
          <li className="step-card step-indigo">
            <span className="step-number">01</span><span className="step-symbol">✦</span>
            <h3>Tell us how you build</h3>
            <p>Share your skills, ambitions, availability, values, and the gaps you want a partner to fill.</p>
          </li>
          <li className="step-card step-lime">
            <span className="step-number">02</span><span className="step-symbol">↔</span>
            <h3>Compare the whole fit</h3>
            <p>Hard constraints filter first. Then a transparent model ranks complementary candidates.</p>
          </li>
          <li className="step-card step-coral">
            <span className="step-number">03</span><span className="step-symbol">↗</span>
            <h3>Start a useful conversation</h3>
            <p>See strengths, possible friction, and specific questions before choosing to connect.</p>
          </li>
        </ol>
      </section>

      <section className="explain-section" aria-labelledby="explain-title">
        <div className="explain-copy">
          <p className="eyebrow eyebrow-light">Compatibility, unpacked</p>
          <h2 id="explain-title">The number is the least interesting part.</h2>
          <p>
            Every recommendation shows the evidence behind it. FoundPair names
            the strengths, flags one real tension, and gives you questions to
            pressure-test the relationship.
          </p>
          <button className="button button-light" type="button" onClick={onDemo}>
            See a match explanation <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="explain-board">
          <div className="explain-row">
            <span className="explain-icon explain-icon-lime">✓</span>
            <div><strong>What could click</strong><p>Complementary ownership and shared customer focus.</p></div>
            <b>94</b>
          </div>
          <div className="explain-row">
            <span className="explain-icon explain-icon-coral">!</span>
            <div><strong>Worth discussing</strong><p>Different planning styles deserve a real working test.</p></div>
            <b>72</b>
          </div>
          <div className="question-card">
            <span>First-conversation prompt</span>
            <p>“Which decisions should each of you own in the first 90 days?”</p>
          </div>
        </div>
      </section>

      <section className="principles-section" aria-labelledby="principles-title">
        <div className="section-heading">
          <p className="eyebrow">Trust is a product feature</p>
          <h2 id="principles-title">Built for a high-stakes decision.</h2>
        </div>
        <div className="principle-grid">
          <article><span>01</span><h3>Dealbreakers stay hard</h3><p>We never bury commitment, location, or funding conflicts inside an average.</p></article>
          <article><span>02</span><h3>Evidence over vibes</h3><p>Every explanation traces back to the information you and the candidate provided.</p></article>
          <article><span>03</span><h3>Conversation over certainty</h3><p>A match is a reason to talk—not a prediction that your company will succeed.</p></article>
          <article><span>04</span><h3>Private for the demo</h3><p>Your profile stays on this device. No account, public profile, or message is created.</p></article>
        </div>
      </section>

      <section className="faq-section" aria-labelledby="faq-title">
        <div>
          <p className="eyebrow">Good to know</p>
          <h2 id="faq-title">Before you pair up.</h2>
        </div>
        <div className="faq-list">
          <details open><summary>Is FoundPair making the final decision?</summary><p>No. It helps you find and evaluate a promising first conversation. You still need to work together, check references, and discuss equity and expectations.</p></details>
          <details><summary>What makes a strong match?</summary><p>Complementary skills lead the ranking, followed by values, goals, work style, and practical logistics.</p></details>
          <details><summary>Is this a real network yet?</summary><p>This hackathon MVP matches your profile against a realistic seeded cohort. The beta roadmap adds verified profiles and mutual introductions.</p></details>
          <details><summary>Does the demo send a message?</summary><p>No. It creates an editable introduction and saves it locally while clearly confirming that nothing was sent.</p></details>
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-mark" aria-hidden="true">FP</div>
        <p className="eyebrow">Your next company is a team decision</p>
        <h2>Find the person who makes the idea bigger.</h2>
        <p>Three minutes. Clear reasons. A better first conversation.</p>
        <button className="button button-primary" type="button" onClick={onStart}>
          Build my founder profile <span aria-hidden="true">↗</span>
        </button>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-mark" aria-hidden="true">F<span>P</span></span><strong>FoundPair</strong></div>
        <p>Explainable matching for founders building what comes next.</p>
        <p>Hackathon MVP · 2026</p>
      </footer>
    </main>
  );
}
