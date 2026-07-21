#!/bin/bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
COMPOSITOR="$REPO_ROOT/video/gallery-compositor.html"

test -f "$COMPOSITOR"

for card_id in 01 02 03 04; do
  rg -q "'$card_id'" "$COMPOSITOR"
done

for capture in landing-raw.png profile-raw.png results-raw.png detail-raw.png; do
  rg -q "$capture" "$COMPOSITOR"
done

rg -q 'width: 1280px' "$COMPOSITOR"
rg -q 'height: 720px' "$COMPOSITOR"
rg -q 'Explainable matching for serious founders' "$COMPOSITOR"
rg -q 'Skills, needs, values, working style, and logistics' "$COMPOSITOR"
rg -q 'Strong, promising, and exploratory fits' "$COMPOSITOR"
rg -q 'complementary strengths, potential friction' "$COMPOSITOR"

if rg -qi 'message sent|verified profiles are live|AI-generated profile' "$COMPOSITOR"; then
  echo "gallery contains an unsupported product claim" >&2
  exit 1
fi
