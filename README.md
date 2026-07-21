# FoundPair

**A transparent cofounder compatibility and first-conversation tool.**

Built with **Codex and GPT-5.6** for **OpenAI Build Week 2026** in the **Work & Productivity** track.

[Try the live demo](https://thealphanova.com/founderpair/) · [Product specification](docs/superpowers/specs/2026-07-20-founderpair-product-requirements-design.md) · [Implementation plan](docs/superpowers/plans/2026-07-20-founderpair-mvp.md)

## What FoundPair does

Finding a cofounder is not only a résumé search. Two people may have complementary skills but still be incompatible on commitment, timeline, funding expectations, working style, or location.

FoundPair helps idea-stage and pre-seed founders decide **who is worth a first conversation and what they should validate before committing**.

The MVP lets a founder:

1. create a reviewable founder profile;
2. filter candidates with hard incompatibilities;
3. rank eligible candidates across five transparent dimensions;
4. inspect the evidence, strengths, and likely friction behind each match;
5. receive practical first-conversation questions; and
6. create and locally save an editable introduction.

FoundPair is a decision-support prototype. It does not predict whether two people will build a successful company.

## 60-second judge path

No account, API key, or installation is required.

1. Open the [live demo](https://thealphanova.com/founderpair/).
2. Select **Try the demo profile**.
3. Open the first recommended match.
4. Expand **Show scoring details**.
5. Compare the match evidence, potential friction, and first-conversation questions.
6. Select **Start a conversation**, edit the introduction, and save it locally.

The demo uses a clearly labeled fictional founder cohort. Saving an introduction does not send a real message.

## Core workflow

```text
Founder story
    ↓
Reviewable structured profile
    ↓
Hard-constraint filtering
    ↓
Five-dimension compatibility ranking
    ↓
Evidence, strengths, and potential friction
    ↓
First-conversation questions
    ↓
Editable introduction
```

## What is implemented

- Responsive two-step founder profile with validation.
- Local draft recovery for unfinished profiles.
- Reviewable conversion of founder answers into matching attributes.
- Nine fictional founder profiles across roles, industries, and time zones.
- Explicit dealbreakers for:
  - commitment level;
  - startup timeline;
  - location requirements;
  - missing role coverage; and
  - funding direction.
- Reproducible compatibility ranking.
- Match explanations grounded in profile data.
- A required potential-friction section for every recommendation.
- Three tailored questions for the first cofounder conversation.
- Editable introduction with device-local save confirmation.
- Automated tests for scoring, filtering, persistence, and the end-to-end journey.
- Public, installation-free demo.

## Matching model

Hard incompatibilities are checked before scoring. Eligible profiles receive a score from 0 to 100:

```text
30%  complementary skills
25%  values alignment
20%  goals and startup direction
15%  working-style compatibility
10%  logistics
```

Candidates below the recommendation threshold are not presented as matches.

The interface uses broad labels such as **Strong fit**, **Promising fit**, and **Worth exploring** rather than pretending that a numerical score can precisely predict human compatibility.

Every explanation must be supported by profile evidence. The product does not infer protected characteristics, mental-health conditions, or hidden personality traits.

## How Codex and GPT-5.6 were used

FoundPair was developed in a Codex project thread using GPT-5.6 during OpenAI Build Week. The primary `/feedback` Session ID is supplied in the Devpost submission form.

### Where Codex accelerated the work

Codex helped the team:

- turn the initial product idea into a scoped PRD and implementation plan;
- scaffold the React and TypeScript application;
- implement eligibility, scoring, ranking, explanation, and persistence modules;
- build the complete landing-to-introduction user journey;
- create unit and journey tests;
- identify edge cases and failure states;
- review privacy boundaries and misleading product claims;
- prepare the production build and deployment configuration; and
- improve repository documentation and the judge testing path.

### How GPT-5.6 contributed to the final result

GPT-5.6 was used throughout the Codex development workflow to:

- reason about which founder attributes should become hard constraints versus scored preferences;
- convert the product concept into a transparent, testable compatibility model;
- stress-test the model against contradictory profiles and edge cases;
- identify where generated explanations could make unsupported claims;
- propose validation and safety rules;
- review the implementation against the hackathon requirements; and
- refine the judge-facing demo flow and product narrative.

### Runtime implementation note

The submitted public demo does **not** make an OpenAI API request at runtime.

This is a deliberate MVP design decision:

- judges can reproduce the same score from the same inputs;
- no API key is exposed in a public browser application;
- founder profile data remains on the device; and
- the demo can be tested freely without authentication, credits, or rate limits.

GPT-5.6 materially contributed to the product through the Codex build, reasoning, validation, testing, and review process. The runtime matching engine is deterministic and inspectable rather than an opaque model-generated score.

## Human-directed decisions

The following product and engineering decisions were made by the team, not delegated to Codex:

- focus on compatibility validation instead of building another social network;
- prioritize complementary abilities over superficial similarity;
- filter clear dealbreakers before ranking candidates;
- use the five matching dimensions and their weights;
- require every recommendation to show both strengths and friction;
- avoid unsupported psychological or demographic inference;
- keep all profile data on-device for the hackathon MVP;
- use fictional candidates rather than presenting a fake live marketplace; and
- limit the product promise to identifying a worthwhile conversation.

## What was built during Build Week

At the beginning of the Build Week implementation, the repository contained product-definition material but no runnable application.

During the hackathon, the team added:

- the complete React and TypeScript frontend;
- founder-profile creation and validation;
- seeded demo data;
- eligibility and dealbreaker logic;
- compatibility scoring and ranking;
- evidence-based match explanations;
- first-conversation questions;
- editable introductions;
- browser persistence;
- automated tests;
- production deployment; and
- judge-facing setup and testing documentation.

Evidence is available through the dated commit history, the [product specification](docs/superpowers/specs/2026-07-20-founderpair-product-requirements-design.md), and the [implementation plan](docs/superpowers/plans/2026-07-20-founderpair-mvp.md).

## Technical architecture

FoundPair is a static web application built with:

- React 19
- TypeScript 6
- Vite 8
- Vitest
- Testing Library
- ESLint

The application separates concerns into:

- reusable interface components;
- fictional demo data;
- pure domain logic for eligibility, scoring, ranking, and explanations; and
- browser-storage services.

The core matching logic is kept in pure TypeScript modules so it is deterministic, directly testable, and independent of the interface.

No backend, database, authentication service, or OpenAI API key is required for the submitted MVP.

## Run locally

### Requirements

- Node.js 20.19 or newer
- npm 10 or newer

### Installation

```bash
git clone https://github.com/athifashaffy/founderpair.git
cd founderpair
npm ci
```

### Start the development server

```bash
npm run dev -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173/founderpair/
```

### Run verification

```bash
npm test
npm run lint
npm run build
```

The production build is written to `dist/`.

## Manual testing

### Test the seeded judge journey

1. Open the app.
2. Select **Try the demo profile**.
3. Confirm that compatible founders are ranked.
4. Open the first result.
5. Confirm that the detail page shows:
   - scoring dimensions;
   - evidence-based strengths;
   - at least one potential friction point; and
   - three first-conversation questions.
6. Create an introduction and save it.
7. Refresh the page and confirm that local progress is retained where expected.

### Test a custom profile

1. Return to the landing page.
2. Create a founder profile.
3. Complete the required fields.
4. Review the structured profile before continuing.
5. Confirm that candidates who violate hard constraints are excluded.
6. Confirm that the remaining candidates are ranked and explained.

## Privacy and safety boundaries

- Founder profiles and saved drafts remain in browser local storage.
- No profile-processing network request is made.
- The seeded founder profiles are fictional demo data.
- Saving an introduction does not contact another person.
- A compatibility score is not a prediction of relationship or company success.
- The product avoids protected-characteristic and psychological inference.
- Users are encouraged to verify claims through real conversations and trial collaboration.

## Known limitations

This hackathon MVP is not a live founder marketplace.

It does not currently include:

- account creation or identity verification;
- real founder profiles;
- mutual-interest matching;
- messaging or notifications;
- reference or background checks;
- collaboration-outcome tracking;
- adaptive scoring based on real-world results; or
- runtime GPT-5.6 profile interpretation and generative analysis.

The current weights and thresholds are an inspectable prototype, not a scientifically validated measure of cofounder success.

## Future direction

With informed consent and appropriate privacy controls, a future version could use GPT-5.6 at runtime to:

- structure longer free-text founder stories;
- generate evidence-grounded compatibility explanations;
- create personalized interview questions;
- simulate likely areas of disagreement; and
- generate a structured 21-day trial-collaboration plan.

Those features are not claimed as part of the submitted MVP.

## License

Released under the [MIT License](LICENSE).
