# FoundPair Product Requirements Document

**Status:** Approved product direction

**Date:** July 20, 2026

**Product:** FoundPair

**Audience:** Product, design, engineering, hackathon judges, and early testers

## 1. Product summary

FoundPair is an AI-assisted cofounder matching product for idea-stage and
pre-seed founders seeking a long-term business partner. It turns a founder's
skills, values, goals, and working preferences into structured attributes,
ranks potential cofounders with a transparent compatibility model, and
explains the strengths and trade-offs of each match.

> **MVP implementation note (July 20, 2026):** the static hackathon build uses
> deterministic, on-device explanations only. Any future remote AI explanation
> flow must require explicit opt-in, minimize transmitted fields, validate
> evidence references, authenticate requests, and enforce rate and spend limits.

The hackathon MVP proves one core hypothesis: a founder is more likely to act
on a recommendation when the product explains why the relationship could work
instead of presenting an unexplained compatibility score.

**Elevator pitch:** Find the cofounder who complements your skills and shares
your way of building.

## 2. Context and product decisions

The current repository is empty, so this PRD defines the product rather than
documenting an existing implementation. The Devpost story and provisional
technology tags are treated as concept inputs, not evidence of completed
features.

The product will make these decisions:

- Serve idea-stage and pre-seed founders first.
- Optimize for serious, long-term cofounder relationships rather than general
  networking, hackathon teams, or freelance collaboration.
- Use deterministic scoring for ranking and OpenAI for profile structuring and
  human-readable explanations.
- Show both strengths and potential friction; never present a match as a
  guarantee.
- Deliver a narrow, end-to-end hackathon MVP before adding a social network or
  real-time communication platform.

## 3. Problem and opportunity

Early founders usually search for a cofounder through their existing network,
events, or broad online communities. These channels are constrained by who a
person already knows and provide little support for evaluating compatibility.
A promising collaborator may have complementary skills but incompatible
commitment, values, risk tolerance, or communication preferences.

Existing discovery tools often emphasize résumés, keywords, or opaque match
percentages. Founders need decision support that answers three questions:

1. What does this person contribute that I lack?
2. Are our expectations and working styles compatible?
3. What should we discuss before committing to work together?

FoundPair addresses the discovery stage. It helps two people decide whether a
first conversation is worthwhile; it does not claim to predict the success of
a future company or relationship.

## 4. Target user

### Primary persona: the committed early founder

The primary user has an idea, area of interest, or strong desire to start a
company within the next year. They are willing to commit meaningful weekly
time and want a long-term partner rather than a contractor. They can describe
their own strengths but have difficulty finding and evaluating complementary
people outside their network.

Examples include:

- A nontechnical domain expert seeking a product-focused technical cofounder.
- A technical builder seeking a commercially strong partner.
- A repeat founder seeking a partner aligned on values, pace, and risk.

### Secondary users after the MVP

- Accelerators and founder communities that facilitate introductions.
- Experienced operators exploring entrepreneurship.
- Founders who already have a collaborator and want structured compatibility
  prompts before formalizing the relationship.

General friendship, dating, hiring, freelance work, and short-term hackathon
team formation are outside the initial positioning.

## 5. Goals, non-goals, and principles

### MVP goals

- Let a user create a useful founder profile in under three minutes.
- Return at least three ranked candidates from a seeded dataset.
- Explain every recommendation with evidence from both profiles.
- Surface at least one topic the pair should discuss, not only positive traits.
- Let the user express interest and generate a personalized introduction.
- Produce a reliable, understandable three-minute demo for hackathon judges.

### Post-hackathon product goals

- Build sufficient profile supply to produce relevant matches in a user's
  geography, timezone, domain, and stage.
- Improve match quality using explicit feedback and real connection outcomes.
- Establish trust with identity, experience, and commitment verification.
- Help promising matches progress from discovery to structured conversations.

### Non-goals for the MVP

- Real-time chat, video calling, or calendar scheduling.
- A production identity-verification system.
- Automated equity, legal, or incorporation advice.
- A continuously learning recommendation model.
- A public social feed, follower system, or broad professional network.
- Native mobile applications.
- Claims that a score predicts company or relationship success.

### Product principles

- **Explain the recommendation.** Evidence matters more than a precise-looking
  number.
- **Complementarity over similarity.** Shared expectations matter, but founders
  should contribute different strengths.
- **Dealbreakers before ranking.** Hard constraints should not be hidden inside
  a weighted score.
- **Respect sensitive data.** Collect only what improves a match and let users
  control what others see.
- **Encourage conversation.** The product starts due diligence; it does not
  replace it.

## 6. Approaches considered

### Approach A: broad founder social network

Build profiles, search, a feed, direct messages, and community features.

**Trade-off:** This creates a large surface area and may eventually improve
retention, but it dilutes the core value proposition and depends on network
density. It is not appropriate for a one-day MVP.

### Approach B: AI-only matchmaking concierge

Ask users for free text and let an LLM choose and describe matches.

**Trade-off:** This is fast to prototype, but ranking is difficult to test,
explain, and reproduce. It can invent reasons that are not supported by the
profiles.

### Approach C: focused, explainable matching assistant — selected

Use a short guided profile, explicit dealbreakers, deterministic weighted
ranking, and AI-generated explanations grounded in structured profile data.

**Why selected:** It demonstrates a differentiated product loop within the
hackathon window while preserving clear paths toward a larger platform. It is
also easier to test and safer to explain than AI-only ranking.

## 7. MVP experience

### Core journey

1. The user lands on FoundPair and sees the promise: compatible cofounders with
   reasons, not random introductions.
2. The user completes a guided profile with structured choices and a short
   free-text description.
3. FoundPair converts free text into reviewable structured attributes.
4. The user confirms or edits the extracted attributes.
5. FoundPair applies dealbreakers, scores eligible seeded candidates, and shows
   the three best matches.
6. The user opens a match to see complementary strengths, aligned expectations,
   possible friction, and suggested questions.
7. The user expresses interest and receives an editable introduction message.
8. The MVP confirms the action locally; it does not imply that a real message
   was sent.

### MVP screens

1. **Landing:** value proposition, explanation of the process, and one primary
   call to action.
2. **Profile setup:** a compact multi-step form with progress, validation, and
   review.
3. **Match results:** ranked cards with role, location/timezone, top skills,
   score band, and two evidence-backed reasons.
4. **Match detail:** strengths, alignment, likely friction, evidence, and three
   conversation prompts.
5. **Connect:** an editable AI-assisted introduction and a clear demo-mode
   confirmation.

## 8. Profile model

The MVP collects the minimum information needed for useful matching:

- Display name and professional headline.
- Location, timezone, and remote-work preference.
- Current startup stage and whether the user has a specific idea.
- Industry or problem-space interests.
- Skills the user offers and skills they seek.
- Desired cofounder role.
- Weekly availability and target start timeline.
- Intended commitment: exploring, part-time, or full-time.
- Working preferences: pace, communication, planning, and decision style.
- Values: ambition, customer focus, craft, impact, autonomy, and transparency.
- Risk tolerance and funding preference.
- Short free-text background and what the user wants to build.

The MVP must not request government identifiers, financial account details,
precise home addresses, protected-class attributes, or other information that
is not necessary for matching.

## 9. Matching model

### Step 1: eligibility filters

A candidate is excluded when either profile has a conflicting hard constraint:

- Incompatible commitment level or start timeline.
- No workable overlap in timezone or location preference.
- A required role that the other person does not offer.
- Explicitly incompatible funding or company-building intent.

The interface explains exclusions as constraint conflicts, not personal
judgments.

### Step 2: weighted compatibility

Eligible candidates receive a reproducible score from 0 to 100:

$$
S = 0.30C + 0.25V + 0.20G + 0.15W + 0.10L
$$

Where:

- $C$ = complementary skills and role coverage.
- $V$ = values and nonnegotiable alignment.
- $G$ = vision, stage, industry, and company-building goals.
- $W$ = working and communication style compatibility.
- $L$ = logistical compatibility, including timezone and availability.

Scores are presented in broad bands—**Strong fit**, **Promising fit**, and
**Worth exploring**—with the underlying reasons. The UI avoids suggesting that
an 87 is meaningfully more certain than an 84.

Each dimension is normalized to 0–100. **Strong fit** means 80–100,
**Promising fit** means 65–79, and **Worth exploring** means 50–64. Candidates
below 50 are not recommended. The seeded dataset must be designed so the
default demo profile has at least three eligible candidates scoring 50 or
higher.

### Step 3: grounded explanation

OpenAI receives only the two structured profiles and the computed dimension
scores. It returns a fixed schema containing:

- Two or three evidence-backed strengths.
- One potential friction point.
- Three questions for a first conversation.
- A short summary of why the match is worth exploring.

The server rejects claims that cannot be traced to profile fields. If
generation fails, a deterministic template displays the highest-scoring
dimensions and the most important conflict.

## 10. Functional requirements

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---:|---|
| FR-01 | Present a clear landing experience | Must | A new visitor can identify the audience, value, and primary action without signing in. |
| FR-02 | Create and edit a founder profile | Must | Required fields are validated, saved for the session, and reviewable before matching. |
| FR-03 | Structure free-text profile input | Must | AI output follows a validated schema and users can correct every extracted attribute. |
| FR-04 | Apply dealbreaker filters | Must | Ineligible profiles are removed before scoring and no excluded profile appears as a top match. |
| FR-05 | Rank eligible candidates | Must | The same inputs produce the same ordered results, with at least three results in the seeded demo. |
| FR-06 | Explain each match | Must | Every detail view shows strengths, evidence, one friction point, and three conversation prompts. |
| FR-07 | Handle AI failure | Must | Matching still works and a template explanation appears when AI is unavailable or malformed. |
| FR-08 | Express interest | Must | The user can generate and edit an introduction; the UI accurately labels the action as demo-only. |
| FR-09 | Revise matching inputs | Should | Editing profile attributes recalculates and reranks the results. |
| FR-10 | Protect private profile data | Must | Only fields explicitly marked visible appear on match cards and details. |
| FR-11 | Support the demo dataset | Must | At least eight varied, realistic candidate profiles produce visibly different rankings. |
| FR-12 | Explain the scoring model | Should | Users can open a short explanation of factors, dealbreakers, and score bands. |
| FR-13 | Support keyboard and small screens | Must | The core journey works at 360px width and is completable without a mouse. |

## 11. System design

### Recommended MVP architecture

- **React web client:** profile flow, results, details, and connect experience.
- **Node.js API:** input validation, session orchestration, scoring, OpenAI calls,
  and response shaping.
- **Server-side JSON fixtures:** seeded candidate profiles used only for the
  hackathon demo.
- **Browser local storage:** the current user's in-progress profile and demo
  connection intents; no account or server-side user persistence in Phase 1.
- **OpenAI API:** structured extraction, grounded explanations, conversation
  prompts, and editable introductions.

Python and PostgreSQL are unnecessary for the one-day MVP. PostgreSQL becomes
the system of record when real accounts are introduced in Phase 2. A separate
Python matching or experimentation service should be introduced only when
offline evaluation or model complexity justifies another service boundary.

### Component boundaries

- `profile` owns input schemas, validation, visibility, and profile updates.
- `eligibility` evaluates hard constraints and returns explicit reason codes.
- `scoring` is a pure, deterministic function that returns dimension scores and
  an overall band.
- `explanations` builds grounded prompts, validates structured AI responses,
  and provides deterministic fallbacks.
- `connections` records interest and creates an editable introduction without
  pretending to deliver it in the MVP.

These boundaries allow the scoring weights, AI model, database, and future
messaging provider to change independently.

### Data flow

1. The client stores the in-progress profile locally and submits validated
   profile input to the API.
2. The API optionally structures free text and returns attributes for user
   confirmation.
3. Confirmed attributes are compared with seeded candidate profiles.
4. Eligibility removes candidates with hard conflicts.
5. Scoring ranks the remaining candidates.
6. Explanation generation runs for the top candidates and falls back safely on
   failure.
7. The API returns match cards and detail payloads; the client does not receive
   hidden candidate fields.

## 12. Error handling and edge cases

- If fewer than three profiles are eligible, show all eligible results and
  identify which user constraints narrowed the pool.
- If no profile is eligible, let the user relax one constraint at a time; do
  not silently ignore dealbreakers.
- If OpenAI times out or returns invalid data, use a deterministic explanation
  and keep results available.
- If a user submits vague or contradictory free text, flag the conflicting
  fields for confirmation rather than guessing.
- If a session is refreshed, restore the in-progress profile from local storage
  for the demo.
- If a match score is tied, order candidates by skill complementarity and then
  stable profile ID so results do not jump between requests.
- Never infer or display sensitive personal traits from free text.

## 13. Trust, safety, privacy, and accessibility

### Trust and safety

- Label AI-generated content and allow users to edit it.
- Provide report and block controls before opening the product beyond a closed
  test group.
- Add moderation for profile text and introductions before public launch.
- Avoid protected attributes in ranking and audit stored fields before any
  learning system is introduced.
- Present suggested conversation topics about equity, commitment, and conflict
  as prompts—not legal advice.

### Privacy

- Separate private matching attributes from fields visible to other users.
- Request explicit consent before a profile becomes discoverable.
- Provide profile deletion and data export before public beta.
- Do not use user profile content to train product models without explicit,
  separate consent.

### Accessibility

- Use semantic form controls, persistent labels, keyboard-visible focus, and
  descriptive validation messages.
- Do not encode score bands or status using color alone.
- Meet WCAG AA contrast for core screens.
- Respect reduced-motion preferences.

## 14. Analytics and success measures

### MVP instrumentation

Track events without recording free-text profile content:

- `profile_started`
- `profile_completed`
- `matches_viewed`
- `match_detail_viewed`
- `explanation_expanded`
- `interest_started`
- `interest_confirmed`
- `constraint_relaxed`
- `ai_fallback_used`

### MVP success criteria

- A first-time tester completes the profile and reaches matches without help.
- Median profile completion time is under three minutes.
- At least 80% of test sessions return three eligible matches.
- At least 70% of testers rate one top-three explanation as specific and useful.
- At least 40% of testers open a match detail and start an introduction.
- AI or network failure does not prevent the matching demo.

### Post-hackathon north-star signal

The primary product signal is the percentage of recommended pairs who both
express interest and complete a first structured conversation. This is more
meaningful than profile views, raw match counts, or time spent in the app.

## 15. Testing and demo acceptance

### Required automated tests

- Profile validation accepts valid inputs and rejects incomplete or malformed
  values.
- Eligibility handles every hard-constraint conflict.
- Scoring is deterministic, bounded from 0 to 100, and respects documented
  weights.
- Ranking is stable for ties and changes predictably when a dimension changes.
- AI schemas reject missing, unsupported, or malformed claims.
- Fallback explanations work without network access.
- API responses omit private fields.

### Required journey tests

- Complete the happy path from landing to demo connection at desktop and
  360px-wide viewport sizes.
- Edit extracted attributes before matching.
- Relax a constraint after a zero-match result.
- Simulate an OpenAI timeout and finish the journey using fallbacks.
- Complete the core flow using only a keyboard.

### Demo acceptance checklist

- Eight or more candidate profiles are available.
- The default demo profile returns three distinct matches.
- Each result has evidence, a friction point, and conversation prompts.
- One profile edit visibly changes the ranking.
- AI failure can be demonstrated without breaking the flow.
- The connect step clearly says whether an introduction was actually delivered.

## 16. Roadmap

### Phase 1: hackathon MVP

- Guided profile and attribute confirmation.
- Seeded candidate dataset.
- Hard filters and deterministic ranking.
- AI-generated grounded explanations with fallbacks.
- Match detail, conversation prompts, and demo connection intent.
- Responsive, keyboard-accessible web experience.

### Phase 2: validation beta

- Authentication and real user profiles.
- Discoverability and field-level privacy controls.
- Mutual interest, asynchronous messaging, report, and block.
- Profile and commitment verification.
- Feedback after introductions and first conversations.
- Admin moderation and a basic quality dashboard.
- Matching evaluation using anonymized, consented outcome data.

### Phase 3: trusted founder network

- Video introductions and structured compatibility sessions.
- Calendar integration for first conversations.
- Warm introductions through accelerators and founder communities.
- Cohort- and geography-aware discovery.
- Personalized weighting based on explicit preferences and observed outcomes.
- Team formation support for a third cofounder or early key hire.

Features move between phases only when research shows they improve successful
first conversations or the trust required to reach them.

## 17. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Insufficient profile supply | Users receive few relevant candidates | Start with a focused cohort or partner community and show constraint-driven pool size. |
| AI invents compatibility claims | Loss of trust or harmful recommendations | Ground generation in structured fields, validate schemas, show evidence, and use templates on failure. |
| Scores imply false certainty | Users over-trust the ranking | Use broad bands, explain dimensions, and include friction plus conversation prompts. |
| Bias enters ranking | Some founders receive systematically worse exposure | Exclude protected traits, test result distributions, document weights, and add review before learning from outcomes. |
| Users misrepresent experience or commitment | Low-quality or unsafe introductions | Add verification, reporting, mutual consent, and post-conversation feedback in beta. |
| MVP becomes a chat platform | Core matching quality remains untested | Keep real-time communication outside Phase 1 and measure explanation usefulness first. |

## 18. Release recommendation

Build the Phase 1 experience as a controlled, demo-ready prototype. Use seeded
profiles so every judge can reach high-quality results, but label demo actions
honestly. After the hackathon, recruit a small cohort of serious idea-stage and
pre-seed founders, measure whether explanations lead to useful first
conversations, and validate the match dimensions before investing in network
and messaging features.
