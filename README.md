# FoundPair

FoundPair is an explainable cofounder matching product for idea-stage and
pre-seed founders. It helps founders discover people with complementary
skills, compatible values, and aligned working expectations—and explains why
each introduction may be worth pursuing.

## Product documentation

- [Product requirements document](docs/superpowers/specs/2026-07-20-founderpair-product-requirements-design.md)
- [Implementation plan](docs/superpowers/plans/2026-07-20-founderpair-mvp.md)

## Hackathon MVP

The MVP focuses on one complete experience:

1. Create a founder profile.
2. Turn free-text answers into structured matching attributes.
3. Rank compatible profiles with a transparent scoring model.
4. Explain each match in plain language.
5. Express interest and generate a thoughtful introduction.

The current app includes the complete profile-to-introduction journey, nine
seeded founder profiles, hard-constraint filtering, deterministic weighted
ranking, grounded explanation fallbacks, responsive layouts, and device-local
profile persistence.

## Local development

Requirements:

- Node.js 20.19 or newer
- npm 10 or newer

Install and start the app:

```bash
npm ci
npm run dev
```

Vite serves FoundPair at `http://127.0.0.1:5173/founderpair/` when started
with `npm run dev -- --host 127.0.0.1`.

Run the verification suite:

```bash
npm test
npm run build
npm run lint
```

The production build is written to `dist/` with asset URLs rooted at
`/founderpair/`.

## Matching architecture

The ranking path does not depend on a model call:

1. Hard conflicts in commitment, timeline, location, required skills, and
   funding direction are removed.
2. Eligible profiles are scored for skill complementarity, values, goals,
   working style, and logistics.
3. Candidates scoring at least 50 are ranked deterministically.
4. Evidence-backed template explanations are always available.
5. Evidence-backed deterministic explanations keep every claim traceable to
   the two profiles without sending profile content off-device.

## Privacy boundary

The hackathon MVP has no remote profile-processing endpoint. Profile drafts,
completed profiles, and saved introduction drafts are versioned and stored in
the browser's local storage. Selecting a match never makes a network request
with profile data.

Generated explanations remain a roadmap item. They require explicit user
opt-in, data minimization, evidence validation, authentication, rate limits,
and spend controls before any profile content may leave the device. Do not add
secrets to this repository or browser-delivered JavaScript.

## cPanel deployment

Build the app, then upload the **contents** of `dist/` to:

```text
public_html/founderpair/
```

The deployed app should then be available at:

```text
https://thealphanova.com/founderpair/
```

The bundled `.htaccess` sets safe caching, compression, and response headers
for an Apache-based cPanel account.

## Demo boundaries

- The candidate cohort is seeded and clearly presented as a hackathon demo.
- Profile setup drafts, completed profiles, and introduction drafts remain on
  the device.
- Saving an introduction does not send a real message.
- Generated compatibility text is decision support, not a prediction of
  relationship or company success.

## Status

The hackathon MVP is implemented. Authentication, real profiles, mutual
interest, messaging, verification, and outcome feedback remain post-hackathon
roadmap items.
