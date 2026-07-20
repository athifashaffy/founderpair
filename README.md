# FoundPair

**Find a complementary cofounder with reasons, not roulette.**

FoundPair helps idea-stage and pre-seed founders decide who is worth a first
conversation. It filters hard incompatibilities, ranks the remaining people
with a transparent five-dimension model, and shows the evidence, likely
friction, and questions behind every recommendation.

[Try the live demo](https://thealphanova.com/founderpair/) ·
[Read the product specification](docs/superpowers/specs/2026-07-20-founderpair-product-requirements-design.md) ·
[Follow the implementation plan](docs/superpowers/plans/2026-07-20-founderpair-mvp.md)

## The 60-second judge path

No account, API key, or installation is required.

1. Open the [live demo](https://thealphanova.com/founderpair/).
2. Select **Try the demo profile**.
3. Open the first match and expand **Show scoring details**.
4. Compare the strengths with the potential friction and first-conversation
   questions.
5. Select **Start a conversation**, edit the introduction, and save it locally.

The demo uses a clearly labeled seeded cohort. Nothing is sent to another
person and profile content never leaves the browser.

## Why FoundPair

Finding a cofounder is not a résumé search. Complementary skills matter, but so
do commitment, values, funding expectations, working style, and logistics.
Most discovery products either optimize for similarity or present an opaque
compatibility number. FoundPair makes a narrower, more honest promise: help a
founder identify a promising conversation and understand what to validate
before committing.

The complete MVP journey is:

```text
founder story → reviewable profile → hard-constraint filter
              → five-dimension ranking → evidence + friction
              → first-conversation questions → editable introduction
```

## What is implemented

- A responsive two-step founder profile with validation and draft recovery.
- Reviewable structuring of free text into matching attributes.
- Nine realistic seeded founder profiles across roles and time zones.
- Explicit dealbreakers for commitment, timeline, location, role coverage,
  and funding direction.
- Reproducible ranking across complementarity, values, goals, work style, and
  logistics.
- Grounded explanations that cite profile evidence and always surface a
  potential friction point.
- Three practical questions for a first cofounder conversation.
- An editable introduction with honest, device-local save confirmation.
- Unit and journey tests covering scoring, filtering, persistence, and the
  end-to-end product path.

## Technical design

FoundPair is a static React 19 + TypeScript 6 application built with Vite. Pure
domain modules own eligibility, scoring, ranking, and explanations, which
makes the core behavior deterministic and directly testable.

Eligible profiles receive a score from 0 to 100:

```text
score = 30% complementarity
      + 25% values
      + 20% goals
      + 15% work style
      + 10% logistics
```

Candidates below 50 are not recommended. The UI presents broad bands—Strong
fit, Promising fit, and Worth exploring—because false precision would be
misleading. Every explanation is assembled from the two profiles and computed
scores; unsupported personality or demographic claims are not permitted.

## How Codex and GPT-5.6 were used

FoundPair was built during OpenAI Build Week on July 20, 2026. The dated commit
history records the progression from product definition to tested MVP,
hardening, and deployment.

Codex accelerated the work by:

- turning the product brief into a scoped PRD and implementation plan;
- scaffolding the React and TypeScript application;
- implementing and testing eligibility, scoring, ranking, and persistence as
  small domain modules;
- iterating on the responsive interaction design and the full
  landing-to-introduction journey;
- reviewing privacy boundaries, failure states, and misleading product claims;
- preparing deployment assets and verifying the production build; and
- using GPT-5.6 Sol for the final rules audit, repository documentation,
  judge-oriented testing path, and demo narrative.

The key product and engineering decisions remained human-directed: choose a
focused decision-support tool instead of a social network, prioritize
complementarity over superficial similarity, filter dealbreakers before
ranking, show friction as well as strengths, and keep sensitive profile data
on-device for the MVP.

GPT-5.6 is used at build time through Codex, not as a hidden runtime dependency.
The shipped browser app intentionally makes no OpenAI API request. This keeps
the public demo free to test, avoids exposing an API key, and preserves the
product's privacy promise. A remote generative explanation service remains a
post-hackathon option only after opt-in, authentication, evidence validation,
rate limits, and spend controls exist.

## Run locally

Requirements: Node.js 20.19 or newer and npm 10 or newer.

```bash
git clone https://github.com/athifashaffy/founderpair.git
cd founderpair
npm ci
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/founderpair/`.

Run the complete verification suite:

```bash
npm test
npm run build
npm run lint
```

The production build is written to `dist/` with asset URLs rooted at
`/founderpair/`.

## Privacy and demo boundaries

- Profiles, in-progress edits, and introduction drafts use versioned browser
  local storage.
- No profile-processing network request is made.
- Seeded profiles are fictional demo data, not a live founder network.
- Saving an introduction does not send a message.
- A match is decision support, not a prediction of relationship or company
  success.

Authentication, verified profiles, mutual interest, messaging, and
outcome-based evaluation are deliberately outside this hackathon MVP.

## License

Released under the [MIT License](LICENSE).
