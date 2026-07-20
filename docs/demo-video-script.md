# FoundPair demo video script

Target length: 2:35–2:50. The submitted video must remain at or under 3:00,
include English narration, and be publicly visible on YouTube.

## Before recording

- Use a 1920×1080 canvas and browser zoom of 100%.
- Close personal tabs, bookmarks, notifications, password-manager prompts,
  and browser developer tools.
- Open the live demo in a clean window and reset it to the landing page.
- Open the repository README in a second clean window at the **How Codex and
  GPT-5.6 were used** section.
- Do not use background music. Record clear narration and add English captions.
- Perform one dry run; keep the final export below 2:55.

## Shot list and narration

### 0:00–0:15 — The problem

**Screen:** FoundPair landing hero. Hold long enough to read the headline.

**Narration:**

> Choosing a cofounder is one of a founder's highest-stakes decisions, but most
> discovery tools rely on existing networks, résumé similarity, or an opaque
> match score. FoundPair helps founders find a complementary partner—and shows
> the reasons and risks behind every recommendation.

### 0:15–0:33 — Product promise

**Screen:** Slowly scroll through the three-step explanation and the
evidence/friction section, then return to the hero.

**Narration:**

> The product is designed for idea-stage and pre-seed founders. It asks what
> you bring, what you need, how you want to build, and which practical
> constraints matter. It is decision support for a first conversation, not a
> claim that software can predict a successful partnership.

### 0:33–0:52 — Profile flow

**Screen:** Select **Find my cofounder**. Enter the name `Avery Chen`. In the
story field enter: `Full-time engineer building venture-backed climate
software and looking for a commercial cofounder.` Select **Continue** and
briefly show the structured fields.

**Narration:**

> A short founder story becomes a reviewable profile. Founders always confirm
> the structured attributes before matching, so an automated interpretation
> never silently becomes ground truth. Drafts remain on this device.

### 0:52–1:13 — Matching architecture

**Screen:** Select **Show my matches**. Pause on the ranked cards and expand
**Show scoring details** on the first card.

**Narration:**

> FoundPair first removes hard conflicts in commitment, timing, location, role
> coverage, and funding direction. Eligible profiles are then scored across
> skill complementarity, values, goals, work style, and logistics. The model is
> deterministic, testable, and visible instead of hiding judgment in a black
> box.

### 1:13–1:42 — The magic moment

**Screen:** Open the top match. Point to the match summary, score breakdown,
strengths, friction, and conversation questions.

**Narration:**

> This is the key moment. FoundPair does not stop at eighty-four percent. It
> identifies the profile evidence that supports the match, surfaces the weakest
> dimension as a real topic to discuss, and prepares three specific questions
> for the pair's first conversation. The number is less important than the
> reasoning a founder can challenge.

### 1:42–1:59 — Action without deception

**Screen:** Select **Start a conversation**, edit one sentence, then select
**Save introduction**. Pause on the local-only confirmation.

**Narration:**

> The final step turns the analysis into an editable introduction. In this
> hackathon demo, saving is explicitly local and no real message is sent. The
> seeded cohort is fictional, and no profile-processing request leaves the
> browser.

### 1:59–2:29 — Codex and GPT-5.6

**Screen:** Switch to the GitHub README at **How Codex and GPT-5.6 were used**.
Briefly show the dated commit history and test files. If safe, show a short,
non-sensitive Codex view from the primary build thread.

**Narration:**

> I built FoundPair with Codex during OpenAI Build Week. Codex helped turn the
> product brief into a scoped PRD, split the matching system into testable
> domain modules, implement the responsive end-to-end journey, and review
> privacy and failure states. GPT-5.6 Sol in Codex supported the final rules
> audit, repository documentation, testing path, and this demo narrative. I
> made the key decisions to reject AI-only ranking, filter dealbreakers before
> scoring, show friction as well as strengths, and keep profile data on-device.

### 2:29–2:45 — Close

**Screen:** Return to the landing page and hold on the product preview plus
live URL.

**Narration:**

> FoundPair makes the case for a simple shift: cofounder matching should give
> people reasons to talk, not a number to trust. The live demo needs no account
> or API key. Thank you for watching.

## Recording checklist

- [ ] Final duration is no more than 3:00.
- [ ] English voiceover is audible throughout.
- [ ] The working product, Codex contribution, and GPT-5.6 contribution are all
      explicitly covered.
- [ ] No personal information, tokens, private tabs, copyrighted music, or
      unlicensed third-party material is visible.
- [ ] The uploaded YouTube visibility is **Public**, not Private or Unlisted.
- [ ] Captions have been reviewed for product name and technical terms.
- [ ] The YouTube URL has been added to Devpost and tested while signed out.
