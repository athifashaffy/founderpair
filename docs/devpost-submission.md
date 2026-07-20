# FoundPair — Devpost submission copy

## Track

Apps for Your Life

## Tagline

Find a complementary cofounder with reasons, not roulette.

## Project links

- Demo: https://thealphanova.com/founderpair/
- Repository: https://github.com/athifashaffy/founderpair
- Video: `ADD PUBLIC YOUTUBE URL`
- Codex `/feedback` Session ID: `ADD SESSION ID FROM THE PRIMARY BUILD THREAD`

## Inspiration

The most consequential early-stage hire is not really a hire: it is the person
you choose to build the company with. Yet founders still rely on warm
introductions, broad communities, résumé keywords, or unexplained match
percentages. Those methods miss the questions that actually determine whether
two people should spend years building together: Do their skills complement
each other? Are their commitment and funding expectations aligned? Can they
work through disagreements in compatible ways?

FoundPair was inspired by a simple idea: a recommendation is only useful when
it explains both why the relationship could work and what the pair should
validate next.

## What it does

FoundPair turns a founder's story into a reviewable profile of skills, needs,
values, goals, working style, availability, and logistics. It removes
candidates with hard conflicts before ranking the remaining people across five
transparent dimensions: skill complementarity, values, goals, work style, and
logistics.

Every recommended match includes evidence-backed strengths, one likely
friction point, the full score breakdown, and three questions for a first
conversation. The user can then generate, edit, and save a thoughtful
introduction. The hackathon MVP uses a fictional seeded cohort and stores all
user-entered data locally in the browser, so judges can test the entire journey
without an account or API key.

## How we built it

FoundPair is a static React 19 and TypeScript 6 application built with Vite.
The matching system is deliberately split into pure domain modules:

1. eligibility filters enforce explicit dealbreakers;
2. a deterministic weighted model computes five dimension scores;
3. stable ranking returns candidates scoring 50 or higher; and
4. grounded templates turn profile evidence and the weakest score dimension
   into strengths, friction, and conversation prompts.

Browser storage is versioned and defensive: malformed, unavailable, or
quota-limited storage does not break the form or create a false success state.
The codebase includes unit tests for domain behavior and interaction tests for
the complete landing-to-introduction path.

Codex was the development collaborator across product scoping, architecture,
test-driven implementation, responsive UI iteration, privacy review, failure
state hardening, and deployment. GPT-5.6 Sol in Codex was also used for the
final rules audit, judge-facing README, testing path, and demo narrative. The
human-directed decisions were to avoid an AI-only black box, filter hard
constraints before scoring, show negative evidence as well as positive
evidence, and keep profile data on-device. GPT-5.6 is a build-time collaborator;
the shipped demo has no hidden model call or exposed API key.

## Challenges we ran into

The hardest challenge was making a match feel useful without pretending that
software can predict cofounder success. We rejected an AI-only ranking approach
because it would be difficult to reproduce, test, or challenge. The resulting
hybrid product design uses transparent deterministic scoring and grounded
language that can only refer to supplied profile evidence.

A second challenge was privacy. Founder profiles can contain sensitive career
and personal context. Instead of rushing a remote endpoint into a public demo,
we designed a complete local-first journey and documented the controls required
before any future model receives profile content.

Finally, a narrow hackathon scope required saying no to authentication, chat,
and a live marketplace so that the core decision-support loop could be
complete, responsive, and testable.

## Accomplishments that we're proud of

- A polished, end-to-end product experience rather than a disconnected proof
  of concept.
- Transparent scoring that judges can inspect and reproduce.
- Explanations that name likely friction instead of overselling compatibility.
- A privacy boundary that matches the product's claims.
- A no-sign-up live demo that takes under one minute to evaluate.
- Dated product documents, incremental commits, and automated tests that make
  the Codex-assisted engineering process auditable.

## What we learned

Explainability is not a paragraph added after a score; it changes the system
architecture. Starting with hard constraints, keeping scoring deterministic,
and restricting every sentence to profile evidence produced a product that is
easier to trust, test, and improve.

We also learned that the most valuable AI collaboration came from iteration:
using Codex to challenge scope, convert product principles into invariants,
write tests around those invariants, and repeatedly check that the interface
did not claim more than the implementation delivered.

## What's next for FoundPair

The next milestone is a consent-based beta with verified founder profiles,
mutual interest, and structured post-conversation feedback. That feedback can
measure whether recommendations lead to useful conversations rather than
optimizing for clicks. Remote GPT-5.6 assistance could then help normalize
free-text profiles and improve explanations, but only with explicit opt-in,
data minimization, evidence validation, authentication, rate limits, and spend
controls.

Longer term, FoundPair can support accelerators and founder communities while
keeping its core promise: help people make a better first-conversation
decision, never pretend to choose a life-changing partner for them.

## Built with

Codex, GPT-5.6 Sol, React, TypeScript, Vite, Vitest, Testing Library, ESLint,
HTML5, CSS3, localStorage

## Testing instructions

Open the live demo and select **Try the demo profile**. Open the first match,
expand **Show scoring details**, review the evidence and friction, then select
**Start a conversation**. Edit and save the introduction. No login or test
credentials are required; the action is intentionally stored only in the
browser and does not send a real message.
