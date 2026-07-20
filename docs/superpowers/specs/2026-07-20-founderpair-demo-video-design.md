# FoundPair Devpost Demo Video Design

**Status:** Approved creative direction

**Date:** July 20, 2026

**Audience:** OpenAI Build Week judges, hackathon participants, and prospective early users

## Goal

Create a concise product demonstration that proves FoundPair's complete MVP
journey: understand the problem, see ranked cofounder matches, inspect the
evidence behind a recommendation, and save a thoughtful introduction.

The video must show the live deployment at
`https://thealphanova.com/founderpair/` and must not imply that seeded profiles
are real users, that a message is delivered, or that the current MVP sends
profile data to an AI service.

## Deliverables

- Primary video: 1920×1080 H.264 MP4, 16:9, approximately 70 seconds.
- Audio: clear English narration with no background music.
- Accessibility: burned-in English captions synchronized to narration.
- Thumbnail frame: a clean FoundPair landing-page frame suitable for Devpost.
- Source artifacts: narration script and scene manifest stored beside the
  rendered video.

## Creative approach

Use a narrated product walkthrough rather than a silent screen recording or a
cinematic teaser. The walkthrough prioritizes proof of the working product,
keeps the product UI readable, and gives judges enough context without slowing
the demo.

Visual motion should be restrained: clean cuts, short crossfades, gentle
push-ins, and a visible pointer or highlight only when it helps locate the next
action. The FoundPair indigo, coral, lime, and warm-paper palette remains the
visual system for title and closing cards.

## Storyboard and narration

### Scene 1 — Hook (0–7 seconds)

**Visual:** FoundPair title card, followed by the live landing-page hero.

**Narration:** “Finding a cofounder should not depend on luck, one event, or
who already happens to be in your network.”

**Caption emphasis:** `Find the cofounder who completes the picture.`

### Scene 2 — Product promise (7–16 seconds)

**Visual:** Hold on the landing page and its product preview; highlight
complementary skills, aligned values, and explainable recommendations.

**Narration:** “FoundPair turns skills, values, working style, and practical
constraints into transparent, explainable cofounder recommendations.”

### Scene 3 — Start with a profile (16–28 seconds)

**Visual:** Activate the demo profile, briefly show profile setup fields,
including commitment, time zone, and work-location preference, then continue
to results.

**Narration:** “A founder describes what they bring, what they need, and how
they want to build. Hard dealbreakers are checked before anyone is ranked.”

### Scene 4 — Ranked matches (28–40 seconds)

**Visual:** Show the ranked results, lead with the broad fit bands, and pause
on Maya Brooks as the strongest match.

**Narration:** “The deterministic matching model ranks eligible profiles for
skill coverage, values, goals, working style, and logistics.”

**Caption emphasis:** `Reasons, not roulette.`

### Scene 5 — Explain the recommendation (40–55 seconds)

**Visual:** Open Maya's detail view. Show “What could click,” “Worth
discussing,” and the three first-conversation prompts. Keep exact scoring
details collapsed.

**Narration:** “Every match explains what could click, surfaces one real point
of friction, and suggests questions that help founders test the relationship.”

### Scene 6 — Take the next step (55–64 seconds)

**Visual:** Create an introduction, show the editable message, and save it.
Hold long enough to read “Saved on this device — no message was sent.”

**Narration:** “When a match feels promising, FoundPair creates an editable,
profile-grounded introduction and saves it privately on the device.”

### Scene 7 — Close (64–72 seconds)

**Visual:** FoundPair closing card with the live URL and concise MVP/roadmap
labels.

**Narration:** “FoundPair makes the first cofounder conversation more
intentional. The MVP is live now, with verified profiles and mutual
introductions next.”

**On-screen copy:**

- `FoundPair`
- `Better chemistry starts with better context.`
- `thealphanova.com/founderpair`
- `MVP: explainable seeded matching`
- `Next: verified profiles + mutual introductions`

## Capture and assembly

Capture the live HTTPS deployment at a desktop viewport, with all private test
state cleared before the first scene. Use the built-in demo profile so the
recording remains reproducible. Capture clean still or short motion segments
for each scene, then assemble them into a fixed-timeline video with narration,
captions, title cards, and subtle transitions.

If direct motion capture is unreliable, use high-resolution live-page frames
with gentle pan-and-zoom animation. This fallback still shows the real deployed
UI and produces a stable, readable demo.

## Error handling

- If a live page or asset does not load, stop capture and verify the deployment
  rather than recording an error state.
- If narration synthesis is unavailable, render the same approved script with
  a system voice; captions remain authoritative.
- If a scene exceeds the target duration, shorten pauses before removing
  product evidence or privacy disclosures.
- Do not include cPanel, credentials, browser chrome, console output, or other
  unrelated tabs in any frame.

## Acceptance criteria

- The output opens as a valid 1920×1080 H.264 MP4 with audible narration.
- Runtime is between 60 and 80 seconds.
- Captions are legible at 1080p and match the spoken script.
- The live landing, results, match detail, and introduction states are shown.
- The privacy confirmation is readable and no real-message claim is made.
- No credentials, private browser state, cPanel UI, or unrelated tabs appear.
- Product claims match the deployed MVP and clearly separate roadmap items.
- Audio has no clipping, long silence, or copyrighted music.
- The final file is visually inspected from beginning to end before delivery.
