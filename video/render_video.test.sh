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

if rg -q 'drawtext|drawbox|FONT_BOLD|FONT_REGULAR' "$RENDERER"; then
  echo "renderer must not depend on unavailable FFmpeg text filters" >&2
  exit 1
fi

test "$(rg -c -- '-nostdin' "$RENDERER")" = "4"

bash -n "$RENDERER"
