#!/bin/bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
BUILD_DIR="$REPO_ROOT/.video-build"
CAPTURE_DIR="$BUILD_DIR/captures"
SCENE_DIR="$BUILD_DIR/scenes"
AUDIO_DIR="$BUILD_DIR/audio"
TEXT_DIR="$BUILD_DIR/text"
MANIFEST="$REPO_ROOT/video/scenes.tsv"
NARRATION="$REPO_ROOT/video/narration.txt"
OUTPUT_VIDEO="/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo.mp4"
OUTPUT_THUMBNAIL="/Users/athifshaffy/Desktop/FoundPair-Devpost-Thumbnail.png"
FONT_BOLD="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REGULAR="/System/Library/Fonts/Supplemental/Arial.ttf"

mkdir -p "$SCENE_DIR" "$AUDIO_DIR" "$TEXT_DIR"

for dependency in ffmpeg ffprobe say awk; do
  command -v "$dependency" >/dev/null
done

for required in "$MANIFEST" "$NARRATION" "$FONT_BOLD" "$FONT_REGULAR"; do
  test -f "$required"
done

scene_count="$(awk -F '\t' 'NR > 1 { count += 1 } END { print count + 0 }' "$MANIFEST")"
narration_count="$(awk 'BEGIN { RS="" } NF { count += 1 } END { print count + 0 }' "$NARRATION")"
test "$scene_count" = "7"
test "$narration_count" = "$scene_count"

concat_file="$BUILD_DIR/scene-list.txt"
: > "$concat_file"

scene_index=0
while IFS=$'\t' read -r scene_id duration capture heading short_caption; do
  if [ "$scene_id" = "id" ]; then
    continue
  fi

  scene_index=$((scene_index + 1))
  capture_path="$CAPTURE_DIR/$capture"
  audio_path="$AUDIO_DIR/$scene_id.wav"
  scene_path="$SCENE_DIR/$scene_id.mp4"
  heading_path="$TEXT_DIR/$scene_id-heading.txt"
  caption_path="$TEXT_DIR/$scene_id-caption.txt"

  test -f "$capture_path"
  dimensions="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$capture_path")"
  test "$dimensions" = "1920x1080"

  printf '%s\n' "$heading" > "$heading_path"
  awk -v target="$scene_index" '
    BEGIN { RS=""; ORS="" }
    NR == target { print; exit }
  ' "$NARRATION" > "$caption_path"

  narration_text="$(tr '\n' ' ' < "$caption_path")"
  /usr/bin/say -v Samantha -r 175 -o "$AUDIO_DIR/$scene_id.aiff" -- "$narration_text"
  ffmpeg -y -loglevel error \
    -i "$AUDIO_DIR/$scene_id.aiff" \
    -af "apad=pad_dur=$duration" -t "$duration" -ar 48000 -ac 2 \
    -c:a pcm_s16le "$audio_path"

  frames=$((duration * 30))
  video_filter="zoompan=z='min(1+0.00018*on,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,drawbox=x=0:y=780:w=1920:h=300:color=0x18172a@0.88:t=fill,drawtext=fontfile='$FONT_BOLD':textfile='$heading_path':fontcolor=0xc9f36a:fontsize=42:x=110:y=820,drawtext=fontfile='$FONT_REGULAR':textfile='$caption_path':fontcolor=white:fontsize=34:line_spacing=12:x=110:y=900"

  ffmpeg -y -loglevel error \
    -loop 1 -framerate 30 -i "$capture_path" \
    -i "$audio_path" \
    -vf "$video_filter" \
    -frames:v "$frames" -shortest \
    -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 \
    -c:a aac -b:a 192k -ar 48000 \
    "$scene_path"

  printf "file '%s'\n" "$scene_path" >> "$concat_file"
done < "$MANIFEST"

ffmpeg -y -loglevel error \
  -f concat -safe 0 -i "$concat_file" \
  -c copy -movflags +faststart "$OUTPUT_VIDEO"

ffmpeg -y -loglevel error \
  -i "$CAPTURE_DIR/landing.png" -frames:v 1 "$OUTPUT_THUMBNAIL"

printf '%s\n%s\n' "$OUTPUT_VIDEO" "$OUTPUT_THUMBNAIL"
