# FoundPair ElevenLabs Narration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render a separate 61-second FoundPair demo video with ElevenLabs narration.

**Architecture:** A focused shell renderer calls ElevenLabs once per narration paragraph, validates timing, reuses the existing captioned frames, and emits a separate H.264/AAC MP4. Credentials remain environment-only.

**Tech Stack:** POSIX shell, curl, ElevenLabs Text-to-Speech API, FFmpeg, FFprobe

## Global Constraints

- Preserve all seven existing visuals, captions, claims, and scene durations.
- Never print, write, or commit `ELEVENLABS_API_KEY`.
- Preserve the existing Samantha-narrated Desktop MP4.
- Output `/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo-ElevenLabs.mp4`.

---

### Task 1: Add renderer contract test

**Files:**
- Create: `video/render_video_elevenlabs.test.sh`
- Create: `video/render_video_elevenlabs.sh`

**Interfaces:**
- Consumes: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `video/narration.txt`, `video/scenes.tsv`, final PNG captures.
- Produces: `/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo-ElevenLabs.mp4`.

- [ ] Write a shell test requiring environment-only secrets, seven API requests, timing validation, `-nostdin`, and the distinct output path.
- [ ] Run it and confirm it fails because the renderer does not exist.
- [ ] Implement the smallest renderer satisfying the contract.
- [ ] Run the contract test and existing video test.

### Task 2: Generate authenticated narration

**Files:**
- Generated outside Git: `.video-build/elevenlabs/audio/*.mp3`

- [ ] Query the authenticated voices endpoint without logging the API key and select a warm professional English stock voice.
- [ ] Run the renderer with runtime-only credentials.
- [ ] Confirm all seven API requests succeed and every clip fits its scene without truncation.

### Task 3: Verify and deliver

**Files:**
- Generated outside Git: `/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo-ElevenLabs.mp4`

- [ ] Decode the full MP4 with FFmpeg.
- [ ] Verify 1920×1080 H.264 `yuv420p`, AAC 48 kHz, 60–80 seconds.
- [ ] Check for silence of 2.5 seconds or more and inspect a contact sheet.
- [ ] Run `npm test -- --run`, `npm run build`, `npm run lint`, both video renderer tests, and `git diff --check`.
- [ ] Commit and push the source changes without generated media or credentials.
