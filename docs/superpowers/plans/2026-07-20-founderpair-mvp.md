# FoundPair MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a demo-ready FoundPair web app that collects a founder profile, ranks seeded cofounders, explains each match, and creates an editable introduction.

**Architecture:** A static React + TypeScript single-page app owns the profile flow and device-local state. Pure domain modules perform eligibility, scoring, ranking, and deterministic explanations. A small optional PHP endpoint can call OpenAI from cPanel without exposing a key; the client falls back to deterministic explanations whenever that endpoint is unavailable.

**Tech Stack:** React 19, TypeScript 5, Vite 7, Vitest, Testing Library, CSS, PHP 8-compatible OpenAI proxy, cPanel static hosting

## Global Constraints

- Production base path is exactly `/founderpair/`.
- The first usable profile must take under three minutes.
- The seeded dataset contains at least eight realistic candidate profiles.
- Matching remains functional without OpenAI or network access.
- Ranking is deterministic and excludes hard conflicts before scoring.
- Match results use score bands, evidence, one friction point, and three conversation prompts.
- The core flow works at 360px width and with keyboard input only.
- User profile content remains on the device in Phase 1.
- No credentials, API keys, or hosting details are committed.
- Visual direction may borrow the reference site's bold typography, bordered cards, offset shadows, and clear section rhythm, but uses FoundPair's own indigo, coral, lime, and warm-neutral palette and original layout/copy.

---

## File map

- `package.json`: scripts and pinned application/test dependencies.
- `vite.config.ts`: React/Vitest configuration and `/founderpair/` base path.
- `index.html`: accessible application mount and metadata.
- `src/main.tsx`: React bootstrap.
- `src/App.tsx`: screen orchestration and local persistence.
- `src/styles.css`: responsive FoundPair design system and component styles.
- `src/domain/types.ts`: profile, score, match, and explanation contracts.
- `src/domain/eligibility.ts`: hard-constraint checks.
- `src/domain/scoring.ts`: pure weighted scoring and score bands.
- `src/domain/explanations.ts`: grounded deterministic explanations and prompt questions.
- `src/domain/ranking.ts`: eligibility, scoring, tie-breaking, and result assembly.
- `src/domain/profile.ts`: profile validation and keyword-based free-text structuring.
- `src/data/candidates.ts`: eight or more demo candidates.
- `src/services/explanationClient.ts`: optional PHP/OpenAI call with fallback.
- `src/components/Landing.tsx`: hero, product preview, principles, and CTA.
- `src/components/ProfileWizard.tsx`: compact guided profile flow.
- `src/components/MatchResults.tsx`: ranked cards and constraint guidance.
- `src/components/MatchDetail.tsx`: evidence, friction, prompts, and connect CTA.
- `src/components/ConnectPanel.tsx`: editable introduction and honest demo confirmation.
- `src/test/setup.ts`: DOM test setup.
- `src/**/*.test.ts(x)`: domain and journey tests.
- `public/api/explain.php`: server-side OpenAI proxy with strict input/output handling.
- `public/.htaccess`: subpath and cache behavior for cPanel.

---

### Task 1: Static application foundation

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `App(): JSX.Element`, `npm run dev`, `npm test`, and `npm run build`.

- [ ] **Step 1: Write the failing shell test for the required scaffold**

Run:

```bash
test -f package.json && test -f vite.config.ts && test -f src/App.tsx
```

Expected: FAIL because the application scaffold does not exist.

- [ ] **Step 2: Create the minimal React/Vite configuration**

Use this script contract in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint ."
  }
}
```

Configure Vite with:

```ts
export default defineConfig({
  base: "/founderpair/",
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"] },
});
```

- [ ] **Step 3: Write the failing smoke test**

```tsx
test("renders the FoundPair promise", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /find the cofounder/i })).toBeInTheDocument();
});
```

- [ ] **Step 4: Run the smoke test and verify RED**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because `App` does not render the product promise.

- [ ] **Step 5: Implement the minimal application shell and verify GREEN**

```tsx
export default function App() {
  return <h1>Find the cofounder who completes the picture.</h1>;
}
```

Run: `npm test -- src/App.test.tsx`

Expected: 1 passing test.

- [ ] **Step 6: Commit the foundation**

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src
git commit -m "chore: scaffold FoundPair web app"
```

---

### Task 2: Eligibility and weighted scoring

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/eligibility.ts`
- Create: `src/domain/eligibility.test.ts`
- Create: `src/domain/scoring.ts`
- Create: `src/domain/scoring.test.ts`

**Interfaces:**
- Produces: `checkEligibility(seeker, candidate): EligibilityResult`.
- Produces: `scoreProfiles(seeker, candidate): DimensionScores`.
- Produces: `scoreBand(score): "Strong fit" | "Promising fit" | "Worth exploring" | "Not recommended"`.

- [ ] **Step 1: Define profile and score contracts**

```ts
export type Commitment = "exploring" | "part-time" | "full-time";
export type FounderProfile = {
  id: string;
  name: string;
  role: string;
  timezone: number;
  remotePreference: "remote" | "hybrid" | "local";
  commitment: Commitment;
  startWindow: "now" | "quarter" | "year";
  offers: string[];
  seeks: string[];
  industries: string[];
  values: string[];
  workStyle: string[];
  fundingPreference: "bootstrapped" | "venture" | "open";
  bio: string;
};
export type DimensionScores = {
  complementarity: number;
  values: number;
  goals: number;
  workStyle: number;
  logistics: number;
  overall: number;
};
```

- [ ] **Step 2: Write failing eligibility tests**

```ts
test("excludes incompatible commitment", () => {
  expect(checkEligibility(seeker, { ...candidate, commitment: "exploring" }))
    .toEqual({ eligible: false, reasons: ["commitment"] });
});

test("keeps compatible profiles", () => {
  expect(checkEligibility(seeker, candidate).eligible).toBe(true);
});
```

- [ ] **Step 3: Run eligibility tests and verify RED**

Run: `npm test -- src/domain/eligibility.test.ts`

Expected: FAIL because `checkEligibility` does not exist.

- [ ] **Step 4: Implement hard constraints and verify GREEN**

Implement explicit reason codes for commitment, start window, timezone/location, required role coverage, and funding intent. Run the same command and expect all tests to pass.

- [ ] **Step 5: Write failing scoring tests**

```ts
test("applies the documented weights", () => {
  const scores = scoreProfiles(seeker, candidate);
  expect(scores.overall).toBe(Math.round(
    scores.complementarity * 0.30 + scores.values * 0.25 +
    scores.goals * 0.20 + scores.workStyle * 0.15 + scores.logistics * 0.10
  ));
});

test.each([[80, "Strong fit"], [65, "Promising fit"], [50, "Worth exploring"], [49, "Not recommended"]])(
  "maps %i to %s", (score, band) => expect(scoreBand(score)).toBe(band)
);
```

- [ ] **Step 6: Run scoring tests and verify RED**

Run: `npm test -- src/domain/scoring.test.ts`

Expected: FAIL because the scoring functions do not exist.

- [ ] **Step 7: Implement normalized scoring and verify GREEN**

Use set overlap for values, industries, and work style; bidirectional offered/seeking coverage for complementarity; and bounded timezone/commitment signals for logistics. Clamp every dimension and the total to 0–100. Run both domain test files and expect all tests to pass.

- [ ] **Step 8: Commit the matching core**

```bash
git add src/domain
git commit -m "feat: add explainable compatibility scoring"
```

---

### Task 3: Seeded candidates, ranking, and explanations

**Files:**
- Create: `src/data/candidates.ts`
- Create: `src/domain/ranking.ts`
- Create: `src/domain/ranking.test.ts`
- Create: `src/domain/explanations.ts`
- Create: `src/domain/explanations.test.ts`

**Interfaces:**
- Consumes: `checkEligibility`, `scoreProfiles`, `scoreBand`, and `FounderProfile`.
- Produces: `rankCandidates(seeker, candidates): MatchResult[]`.
- Produces: `buildFallbackExplanation(seeker, candidate, scores): MatchExplanation`.

- [ ] **Step 1: Write failing ranking tests**

```ts
test("filters hard conflicts before returning ranked matches", () => {
  const results = rankCandidates(seeker, [eligibleLow, excludedHigh]);
  expect(results.map((match) => match.profile.id)).toEqual([eligibleLow.id]);
});

test("uses complementarity and stable id to break ties", () => {
  const results = rankCandidates(seeker, tiedCandidates);
  expect(results.map((match) => match.profile.id)).toEqual(["candidate-a", "candidate-b"]);
});
```

- [ ] **Step 2: Run ranking tests and verify RED**

Run: `npm test -- src/domain/ranking.test.ts`

Expected: FAIL because `rankCandidates` does not exist.

- [ ] **Step 3: Implement ranking and add at least eight varied fixtures**

Return only candidates scoring 50 or higher, ordered by overall score, complementarity, then stable ID. Seed technical, commercial, product, design, operations, and domain-specialist profiles across timezones and commitment levels.

- [ ] **Step 4: Verify ranking GREEN**

Run: `npm test -- src/domain/ranking.test.ts`

Expected: all ranking tests pass and the default profile returns at least three matches.

- [ ] **Step 5: Write failing explanation tests**

```ts
test("grounds every fallback explanation in profile evidence", () => {
  const explanation = buildFallbackExplanation(seeker, candidate, scores);
  expect(explanation.strengths.length).toBeGreaterThanOrEqual(2);
  expect(explanation.friction).toBeTruthy();
  expect(explanation.questions).toHaveLength(3);
  expect(JSON.stringify(explanation)).toContain(candidate.offers[0]);
});
```

- [ ] **Step 6: Implement deterministic explanations and verify GREEN**

Build explanations from actual role coverage, shared values, logistics, and the lowest dimension. Never infer demographics or unsupported traits. Run all domain tests and expect them to pass.

- [ ] **Step 7: Commit the complete local matching loop**

```bash
git add src/data src/domain
git commit -m "feat: rank seeded cofounders with grounded explanations"
```

---

### Task 4: Profile structuring and device-local persistence

**Files:**
- Create: `src/domain/profile.ts`
- Create: `src/domain/profile.test.ts`
- Create: `src/services/profileStorage.ts`
- Create: `src/services/profileStorage.test.ts`

**Interfaces:**
- Produces: `structureProfileDraft(text): Partial<FounderProfile>`.
- Produces: `validateProfile(profile): ValidationIssue[]`.
- Produces: `loadProfile()`, `saveProfile(profile)`, and `clearProfile()`.

- [ ] **Step 1: Write failing structuring and validation tests**

```ts
test("extracts technical and venture signals from free text", () => {
  expect(structureProfileDraft("Full-time engineer building a venture-backed climate product"))
    .toMatchObject({ commitment: "full-time", fundingPreference: "venture", industries: ["Climate"] });
});

test("requires identity, role, offered skills, sought skills, and commitment", () => {
  expect(validateProfile(emptyProfile).map((issue) => issue.field))
    .toEqual(["name", "role", "offers", "seeks", "commitment"]);
});
```

- [ ] **Step 2: Verify RED, implement the minimum parser/validator, and verify GREEN**

Run: `npm test -- src/domain/profile.test.ts`

Expected before implementation: FAIL for missing functions. Expected after implementation: all profile tests pass.

- [ ] **Step 3: Write failing storage tests**

```ts
test("round-trips a profile through local storage", () => {
  saveProfile(seeker);
  expect(loadProfile()).toEqual(seeker);
});

test("returns null for malformed stored data", () => {
  localStorage.setItem("foundpair.profile.v1", "not-json");
  expect(loadProfile()).toBeNull();
});
```

- [ ] **Step 4: Implement versioned local storage and verify GREEN**

Catch parsing/quota failures, keep the key `foundpair.profile.v1`, and never transmit storage contents. Run both new test files and expect all tests to pass.

- [ ] **Step 5: Commit profile behavior**

```bash
git add src/domain/profile* src/services/profileStorage*
git commit -m "feat: add profile structuring and local persistence"
```

---

### Task 5: Guided matching journey

**Files:**
- Create: `src/components/ProfileWizard.tsx`
- Create: `src/components/MatchResults.tsx`
- Create: `src/components/MatchDetail.tsx`
- Create: `src/components/ConnectPanel.tsx`
- Create: `src/App.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: profile, persistence, ranking, and explanation modules.
- Produces: the complete `landing → profile → results → detail → connect` journey.

- [ ] **Step 1: Write a failing journey test**

```tsx
test("completes profile setup and opens a recommended match", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /find my cofounder/i }));
  await user.type(screen.getByLabelText(/your name/i), "Avery Chen");
  await user.type(screen.getByLabelText(/what do you bring/i), "Engineering, Product");
  await user.type(screen.getByLabelText(/what do you need/i), "Sales, Growth");
  await user.click(screen.getByRole("button", { name: /show my matches/i }));
  expect(await screen.findByRole("heading", { name: /your strongest matches/i })).toBeInTheDocument();
  await user.click(screen.getAllByRole("button", { name: /view match/i })[0]);
  expect(screen.getByText(/what could click/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the journey test and verify RED**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because the matching journey is not implemented.

- [ ] **Step 3: Implement the profile wizard and results flow**

Use labeled native controls, concise steps, visible progress, inline validation, a reviewable extraction summary, and state-driven screen transitions. Do not add a router or authentication.

- [ ] **Step 4: Implement detail and connect panels**

Show two or more strengths, one friction point, three first-conversation questions, an editable introduction, and the exact confirmation text `Saved for this demo — no message was sent.`

- [ ] **Step 5: Verify GREEN and add zero-match coverage**

Run: `npm test -- src/App.test.tsx`

Expected: the happy path and zero-match constraint guidance pass.

- [ ] **Step 6: Commit the journey**

```bash
git add src/App* src/components
git commit -m "feat: add FoundPair matching journey"
```

---

### Task 6: Original FoundPair visual system and responsive landing page

**Files:**
- Create: `src/components/Landing.tsx`
- Create: `src/styles.css`
- Modify: `src/main.tsx`
- Modify: `index.html`
- Test: `src/components/Landing.test.tsx`

**Interfaces:**
- Produces: responsive landing content and shared component classes.

- [ ] **Step 1: Write a failing landing-content test**

```tsx
test("explains the matching loop and its safeguards", () => {
  render(<Landing onStart={() => undefined} />);
  expect(screen.getByText(/skills that complement/i)).toBeInTheDocument();
  expect(screen.getByText(/reasons, not roulette/i)).toBeInTheDocument();
  expect(screen.getByText(/your profile stays on this device/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify RED and implement the landing structure**

Run: `npm test -- src/components/Landing.test.tsx`

Expected before implementation: FAIL. Build an original hero with a match-card product preview, a three-step explainer, matching-principles strip, privacy statement, FAQ, and final CTA.

- [ ] **Step 3: Implement the visual system**

Use CSS custom properties:

```css
:root {
  --ink: #18172a;
  --paper: #f7f3ea;
  --surface: #fffdf8;
  --indigo: #6c63ff;
  --coral: #ff7a66;
  --lime: #c9f36a;
  --muted: #66647a;
  --border: 2px solid var(--ink);
  --shadow: 5px 5px 0 var(--ink);
}
```

Use bold display typography, bordered cards, restrained offset shadows, asymmetric product framing, ample whitespace, and responsive layouts. Do not reuse the reference site's teal/yellow palette, copy, illustrations, or phone composition.

- [ ] **Step 4: Add responsive and reduced-motion rules**

At widths below 760px, collapse two-column regions, reduce display type with `clamp()`, keep touch targets at least 44px, and prevent horizontal overflow. Disable nonessential transforms and transitions under `prefers-reduced-motion: reduce`.

- [ ] **Step 5: Verify GREEN and commit**

Run: `npm test -- src/components/Landing.test.tsx && npm run build`

Expected: landing tests pass and Vite emits `dist/index.html` with `/founderpair/` assets.

```bash
git add src/components/Landing* src/styles.css src/main.tsx index.html
git commit -m "feat: create FoundPair responsive visual system"
```

---

### Task 7: Optional OpenAI explanation endpoint with deterministic fallback

**Files:**
- Create: `src/services/explanationClient.ts`
- Create: `src/services/explanationClient.test.ts`
- Create: `public/api/explain.php`

**Interfaces:**
- Consumes: `MatchExplanation`, two profiles, and dimension scores.
- Produces: `getMatchExplanation(input, fallback): Promise<MatchExplanation>`.
- HTTP contract: `POST /founderpair/api/explain.php` returns validated explanation JSON or a non-2xx response that triggers the local fallback.

- [ ] **Step 1: Write failing client fallback tests**

```ts
test("returns the deterministic fallback when the endpoint fails", async () => {
  const fetcher = vi.fn().mockRejectedValue(new Error("offline"));
  await expect(getMatchExplanation(input, fallback, fetcher)).resolves.toEqual(fallback);
});

test("rejects an ungrounded endpoint payload and uses fallback", async () => {
  const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ summary: "unsupported" })));
  await expect(getMatchExplanation(input, fallback, fetcher)).resolves.toEqual(fallback);
});
```

- [ ] **Step 2: Verify RED, implement the client, and verify GREEN**

Run: `npm test -- src/services/explanationClient.test.ts`

Expected before implementation: FAIL. The implementation must use a short timeout, validate the complete response shape, and return fallback for any network, status, parsing, or schema failure.

- [ ] **Step 3: Implement the PHP proxy**

Read `OPENAI_API_KEY` from the server environment only. Accept JSON POST bodies under 24 KB, allow only the documented profile/score fields, call the current OpenAI Responses API with a strict JSON instruction, validate that the returned explanation contains 2–3 strengths, one friction string, exactly three questions, and a summary, and return `503` when the key is absent. Never echo upstream errors, prompts, or secrets.

- [ ] **Step 4: Verify PHP syntax and client tests**

Run: `php -l public/api/explain.php && npm test -- src/services/explanationClient.test.ts`

Expected: `No syntax errors detected` and all client tests pass.

- [ ] **Step 5: Commit the optional integration**

```bash
git add src/services public/api
git commit -m "feat: add safe OpenAI explanation fallback"
```

---

### Task 8: Production validation and cPanel package

**Files:**
- Create: `public/.htaccess`
- Modify: `README.md`
- Verify: `dist/`

**Interfaces:**
- Produces: deployable `dist/` contents for `public_html/founderpair/`.

- [ ] **Step 1: Add subpath-safe hosting rules**

Use an `.htaccess` that enables compression and long-lived caching for hashed assets while keeping `index.html` uncached. The app is state-driven and must not require SPA rewrite rules.

- [ ] **Step 2: Run the full automated verification**

Run:

```bash
npm test
npm run build
npm run lint
php -l public/api/explain.php
```

Expected: zero test failures, successful TypeScript/Vite build, zero lint errors, and valid PHP syntax.

- [ ] **Step 3: Verify the production artifact**

Run:

```bash
test -f dist/index.html
test -f dist/api/explain.php
rg -q '/founderpair/assets/' dist/index.html
find dist -type f -size +5M -print
```

Expected: required files exist, asset URLs use the subpath, and the final command prints no files.

- [ ] **Step 4: Run browser journey checks**

At desktop and 360px widths, verify landing → profile → results → detail → connect; keyboard navigation; no horizontal overflow; local profile restoration; and fallback behavior with the endpoint unavailable. Inspect console errors after each journey.

- [ ] **Step 5: Update the README and commit production readiness**

Document local development, tests, build output, deployment path, the optional server-side `OPENAI_API_KEY`, and the fact that no real message is sent.

```bash
git add README.md public/.htaccess
git commit -m "docs: add FoundPair build and deployment guide"
```

- [ ] **Step 6: Push the implementation branch**

Run: `git push -u origin codex/founderpair-mvp`

Expected: the remote branch is created and points at the verified local HEAD.

- [ ] **Step 7: Deploy and verify**

Upload the contents of `dist/` to `public_html/founderpair/` through the authorized cPanel account. Visit `https://thealphanova.com/founderpair/`, complete the core journey, confirm assets and PHP fallback responses load from the subpath, and inspect the browser console for errors.
