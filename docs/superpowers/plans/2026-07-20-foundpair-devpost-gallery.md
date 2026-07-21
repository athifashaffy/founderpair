# FoundPair Devpost Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce four branded, authentic, Devpost-ready FoundPair gallery PNGs.

**Architecture:** A browser-native HTML compositor combines existing product captures with the FoundPair visual system. The browser renders each card at its native 1280×720 viewport, and FFmpeg scales it with Lanczos filtering onto a cream 1800×1200 canvas without stretching or cropping.

**Tech Stack:** HTML/CSS, browser capture, FFmpeg, FFprobe, shell tests

## Global Constraints

- Output exactly four 1800×1200 PNG files.
- Keep every image below 5 MB.
- Use only real deployed-product captures and factual MVP copy.
- Write final files to `/Users/athifshaffy/Desktop/FoundPair-Devpost-Gallery/`.

---

### Task 1: Build the gallery compositor

**Files:**
- Create: `video/gallery-compositor.html`
- Create: `video/gallery-compositor.test.sh`

- [ ] Write a failing shell contract test for four cards, expected screenshot sources, factual captions, and 3:2 dimensions.
- [ ] Run the test and confirm it fails because the compositor is absent.
- [ ] Implement the minimal HTML/CSS compositor.
- [ ] Run the contract test and existing video tests.

### Task 2: Render the gallery

**Files:**
- Generated outside Git: `.video-build/gallery/*.jpg`
- Generated outside Git: `/Users/athifshaffy/Desktop/FoundPair-Devpost-Gallery/*.png`

- [ ] Serve the repository locally and capture cards 01–04 at 1280×720.
- [ ] Scale each capture to 1800×1200 PNG with Lanczos filtering.
- [ ] Verify dimensions, format, and file size.

### Task 3: Review and deliver

- [ ] Inspect a four-image contact sheet for clipping, legibility, privacy, and truthful copy.
- [ ] Run the gallery contract test, existing video tests, application tests, build, lint, and `git diff --check`.
- [ ] Commit and push the reusable compositor source without generated media.
