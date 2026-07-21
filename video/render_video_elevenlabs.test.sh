#!/bin/bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
RENDERER="$REPO_ROOT/video/render_video_elevenlabs.sh"

test -f "$RENDERER"
rg -q ': "\$\{ELEVENLABS_API_KEY:\?' "$RENDERER"
rg -q ': "\$\{ELEVENLABS_VOICE_ID:\?' "$RENDERER"
rg -q 'api\.elevenlabs\.io/v1/text-to-speech/\$ELEVENLABS_VOICE_ID' "$RENDERER"
rg -q 'eleven_multilingual_v2' "$RENDERER"
rg -q 'mp3_44100_128' "$RENDERER"
rg -q 'FoundPair-Devpost-Demo-ElevenLabs\.mp4' "$RENDERER"
rg -q 'narration duration .* exceeds scene' "$RENDERER"
rg -q '04|06' "$RENDERER"
rg -q 'voice_speed=0.9' "$RENDERER"
rg -q -- '--retry 3' "$RENDERER"
rg -q -- '--retry-all-errors' "$RENDERER"
rg -q 'mp3_part_path=' "$RENDERER"
rg -q 'mv -- "\$mp3_part_path" "\$mp3_path"' "$RENDERER"
rg -q 'done < "\$MANIFEST"' "$RENDERER"
test "$(rg -c -- '-nostdin' "$RENDERER")" = "4"

if rg -q 'sk_[A-Za-z0-9]+' "$RENDERER"; then
  echo "renderer must not contain an API key" >&2
  exit 1
fi

bash -n "$RENDERER"
