#!/bin/bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
COMPOSITOR="$REPO_ROOT/video/compositor.html"
RENDERER="$REPO_ROOT/video/render_video.sh"

test -f "$COMPOSITOR"
test -f "$RENDERER"

for scene_id in 01 02 03 04 05 06 07; do
  rg -q "'$scene_id'" "$COMPOSITOR"
done

rg -q "image: 'connect-raw.png'" "$COMPOSITOR"
rg -q "band: 'top-band'" "$COMPOSITOR"
rg -q "thealphanova.com/founderpair" "$COMPOSITOR"
rg -q "heading: 'A high-stakes founder decision'" "$COMPOSITOR"
rg -q "heading: 'Human-directed, Codex-accelerated'" "$COMPOSITOR"
rg -q 'Codex with GPT-5.6 helped us scope the product' "$COMPOSITOR"
if rg -q 'Finding a cofounder should not depend on luck' "$COMPOSITOR"; then
  echo "compositor still contains the previous narration" >&2
  exit 1
fi

if rg -q 'drawtext|drawbox|FONT_BOLD|FONT_REGULAR' "$RENDERER"; then
  echo "renderer must not depend on unavailable FFmpeg text filters" >&2
  exit 1
fi

test "$(rg -c -- '-nostdin' "$RENDERER")" = "5"
test "$(awk -F '\t' 'NR > 1 { total += $2 } END { print total }' "$REPO_ROOT/video/scenes.tsv")" = "152"
test "$(awk -F '\t' '$1 == "03" { print $2 }' "$REPO_ROOT/video/scenes.tsv")" = "28"
test "$(awk -F '\t' '$1 == "05" { print $2 }' "$REPO_ROOT/video/scenes.tsv")" = "18"
rg -q '/usr/bin/say -v Samantha -r 155' "$RENDERER"
rg -q 'narration duration .* exceeds scene' "$RENDERER"
rg -q 'ffmpeg -nostdin -v error -i "\$OUTPUT_VIDEO" -f null -' "$RENDERER"

bash -n "$RENDERER"
