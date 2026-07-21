# FoundPair Demo Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a narrated, captioned, Devpost-ready FoundPair demo video and place the verified MP4 on the user's Desktop.

**Architecture:** Capture reproducible 1920×1080 frames from the live HTTPS deployment using the approved demo journey. A browser compositor creates captioned product frames and branded title cards; a small shell-based production pipeline adds system-voice narration, Ken Burns-style scene motion, and final H.264/AAC encoding with FFmpeg. Text sources and the render script are committed; captures and rendered binaries remain outside Git.

**Tech Stack:** FoundPair live web app, in-app Browser capture, macOS `say` with Samantha voice, FFmpeg 8.1, FFprobe, POSIX shell

## Global Constraints

- Final output is exactly 1920×1080, 16:9, H.264 video with AAC audio.
- Runtime is between 60 and 80 seconds.
- Narration uses the approved script and contains no copyrighted music.
- Burned-in English captions remain inside title-safe margins.
- The video shows landing, profile setup, ranked results, match detail, and introduction states from the live deployment.
- The seeded demo, local-only save behavior, and MVP/roadmap boundary are represented honestly.
- No cPanel, credentials, browser chrome, console output, or unrelated tabs appear.
- Captures and large binary outputs are not committed to Git.
- Final MP4 path is `/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo.mp4`.

---

### Task 1: Production source package

**Files:**
- Create: `video/narration.txt`
- Create: `video/scenes.tsv`
- Create: `video/compositor.html`
- Create: `video/render_video.sh`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: approved storyboard in `docs/superpowers/specs/2026-07-20-founderpair-demo-video-design.md`.
- Produces: a seven-scene manifest and executable renderer that reads PNG captures from `.video-build/captures/` and writes the Desktop MP4.

- [ ] **Step 1: Add a repository hygiene check**

Run:

```bash
test ! -e .video-build
rg -n '^\.video-build/$' .gitignore
```

Expected before implementation: the second command exits non-zero because the build directory is not yet ignored.

- [ ] **Step 2: Add the ignored build directory and narration source**

Append exactly this ignore entry using `apply_patch`:

```gitignore
.video-build/
```

Create `video/narration.txt` with one approved narration paragraph per scene, separated by a blank line. Do not add new product claims or change “saved privately on the device.”

- [ ] **Step 3: Add the scene manifest**

Create `video/scenes.tsv` with tab-separated columns:

```text
id	duration	capture	heading	caption
01	7	title.png	Find your cofounder	Finding a cofounder should not depend on luck.
02	9	landing.png	Explainable matching	Skills, values, working style, and practical constraints.
03	12	profile.png	Start with context	Dealbreakers are checked before ranking.
04	12	results.png	Reasons, not roulette	Transparent, deterministic match bands.
05	15	detail.png	Compatibility, unpacked	Strengths, friction, and first-conversation questions.
06	9	connect.png	Take the next step	Editable and saved privately on this device.
07	8	closing.png	Better chemistry starts with better context.	thealphanova.com/founderpair
```

Expected total: 66 seconds.

- [ ] **Step 4: Implement the render script**

Create `video/render_video.sh` with `set -euo pipefail`. It must:

1. Resolve the repository root and `.video-build` paths without using `$HOME`.
2. Assert that all seven 1920×1080 PNG files exist.
3. Generate one AIFF narration file per scene with `/usr/bin/say -v Samantha -r 135`.
4. Pad or trim each narration file to its manifest duration.
5. Create a scene MP4 from each already-captioned PNG using `zoompan`, `libx264`, and `yuv420p`.
6. Concatenate the seven scene MP4s and audio tracks.
7. Write `/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo.mp4` and extract `/Users/athifshaffy/Desktop/FoundPair-Devpost-Thumbnail.png` from the landing scene.

Use these output settings:

```text
-c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30
-c:a aac -b:a 192k -ar 48000
-movflags +faststart
```

- [ ] **Step 5: Validate sources and commit**

Run:

```bash
bash -n video/render_video.sh
awk -F '\t' 'NR > 1 { total += $2 } END { print total; exit total == 66 ? 0 : 1 }' video/scenes.tsv
git diff --check
```

Expected: shell syntax succeeds, total prints `66`, and the diff check is empty.

Commit:

```bash
git add .gitignore video
git commit -m "feat: add FoundPair demo video pipeline"
```

---

### Task 2: Live product capture

**Files:**
- Create outside Git: `.video-build/captures/landing.png`
- Create outside Git: `.video-build/captures/profile.png`
- Create outside Git: `.video-build/captures/results.png`
- Create outside Git: `.video-build/captures/detail.png`
- Create outside Git: `.video-build/captures/connect.png`
- Create outside Git: `.video-build/captures/title.png`
- Create outside Git: `.video-build/captures/closing.png`

**Interfaces:**
- Consumes: `https://thealphanova.com/founderpair/` and the scene manifest.
- Produces: seven exact-size PNG inputs for `video/render_video.sh`.

- [ ] **Step 1: Verify the live deployment before capture**

Run:

```bash
curl -fsS -o /dev/null https://thealphanova.com/founderpair/
curl -fsS https://thealphanova.com/founderpair/ | rg '/founderpair/assets/'
```

Expected: both commands exit zero.

- [ ] **Step 2: Capture the product journey**

Using the in-app Browser at a 16:9 desktop viewport, capture only the page content:

1. Landing hero before interaction.
2. Profile setup with non-sensitive demo values and logistics controls visible.
3. Ranked results after activating the demo profile.
4. Maya Brooks detail page with strengths and friction visible.
5. Introduction page after saving, with the local-only confirmation visible.

Save each frame at 1920×1080. Do not include browser chrome or other tabs.

- [ ] **Step 3: Create title and closing cards**

Use `video/compositor.html` to render the title and closing cards in the FoundPair palette and to combine every live capture with its approved narration caption. Capture each completed scene at 1280×720 and upscale it to 1920×1080 with Lanczos scaling. The title card includes the product name and elevator pitch. The closing card includes the live URL and the approved MVP/roadmap labels.

- [ ] **Step 4: Validate capture dimensions and privacy**

Run:

```bash
for file in .video-build/captures/*.png; do
  test "$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$file")" = "1920x1080"
done
test "$(find .video-build/captures -name '*.png' | wc -l | tr -d ' ')" = "7"
```

Expected: all dimension checks succeed and the count is `7`.

---

### Task 3: Render and verify the Devpost deliverable

**Files:**
- Create outside Git: `/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo.mp4`
- Create outside Git: `/Users/athifshaffy/Desktop/FoundPair-Devpost-Thumbnail.png`
- Create outside Git: `.video-build/contact-sheet.png`

**Interfaces:**
- Consumes: seven captures, narration, manifest, and render script.
- Produces: upload-ready video and thumbnail on the Desktop.

- [ ] **Step 1: Render the complete video**

Run:

```bash
bash video/render_video.sh
```

Expected: the command exits zero and prints both Desktop output paths.

- [ ] **Step 2: Verify media structure**

Run:

```bash
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,pix_fmt,sample_rate,channels -of json /Users/athifshaffy/Desktop/FoundPair-Devpost-Demo.mp4
```

Expected: duration is between 60 and 80 seconds; video is H.264, 1920×1080, `yuv420p`; audio is AAC, 48 kHz, with at least one channel.

- [ ] **Step 3: Generate a visual contact sheet**

Run:

```bash
ffmpeg -y -i /Users/athifshaffy/Desktop/FoundPair-Devpost-Demo.mp4 -vf "fps=1/9,scale=480:-1,tile=4x2" -frames:v 1 .video-build/contact-sheet.png
```

Expected: one image containing representative frames from the complete timeline.

- [ ] **Step 4: Perform visual and audio QA**

Inspect the contact sheet and the full MP4. Confirm captions are not clipped,
product text remains readable, every scene appears in order, narration is
audible, there are no long silent gaps, and no cPanel or credentials appear.

- [ ] **Step 5: Verify repository hygiene**

Run:

```bash
git status --short
git check-ignore .video-build/captures/landing.png
```

Expected: no uncommitted video binaries appear and the capture path is reported as ignored.
