#!/bin/bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
COMPOSITOR="$REPO_ROOT/video/gallery-compositor.html"
CAPTURE_DIR="$REPO_ROOT/.video-build/captures"
OUTPUT_DIR="${GALLERY_OUTPUT_DIR:-/Users/athifshaffy/Desktop/FoundPair-Devpost-Gallery}"

test -f "$COMPOSITOR"

for card_id in 01 02 03 04; do
  rg -q "'$card_id'" "$COMPOSITOR"
done

for capture in landing-raw.png profile-raw.png results-raw.png detail-raw.png; do
  rg -q "$capture" "$COMPOSITOR"
  test -f "$CAPTURE_DIR/$capture"
  test "$(magick identify -format '%wx%h' "$CAPTURE_DIR/$capture")" = "1280x720"
done

rg -q 'width: 1280px' "$COMPOSITOR"
rg -q 'height: 720px' "$COMPOSITOR"
rg -q 'Explainable matching for serious founders' "$COMPOSITOR"
rg -q 'Skills, needs, values, working style, and logistics' "$COMPOSITOR"
rg -q 'strong, promising, and exploratory fits' "$COMPOSITOR"
rg -q 'complementary strengths, potential friction' "$COMPOSITOR"
rg -q 'object-fit: contain' "$COMPOSITOR"
rg -q 'width: 889px' "$COMPOSITOR"
rg -q 'height: 500px' "$COMPOSITOR"
rg -q 'Ranked by transparent compatibility signals' "$COMPOSITOR"
rg -q 'seeded demo cohort' "$COMPOSITOR"

if rg -qi 'message sent|verified profiles are live|AI-generated profile' "$COMPOSITOR"; then
  echo "gallery contains an unsupported product claim" >&2
  exit 1
fi

test -d "$OUTPUT_DIR"
test "$(find "$OUTPUT_DIR" -maxdepth 1 -type f -name '*.png' | wc -l | tr -d ' ')" = "4"
for output in "$OUTPUT_DIR"/*.png; do
  test "$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height -of csv=p=0 "$output")" = "png,1800,1200"
  test "$(stat -f '%z' "$output")" -lt 5242880
done
