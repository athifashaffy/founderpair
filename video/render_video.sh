#!/bin/bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
BUILD_DIR="$REPO_ROOT/.video-build"
CAPTURE_DIR="$BUILD_DIR/captures"
SCENE_DIR="$BUILD_DIR/scenes"
AUDIO_DIR="$BUILD_DIR/audio"
MANIFEST="$REPO_ROOT/video/scenes.tsv"
NARRATION="$REPO_ROOT/video/narration.txt"
OUTPUT_VIDEO="/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo.mp4"
OUTPUT_THUMBNAIL="/Users/athifshaffy/Desktop/FoundPair-Devpost-Thumbnail.png"

mkdir -p "$SCENE_DIR" "$AUDIO_DIR"

for dependency in ffmpeg ffprobe say awk; do
  command -v "$dependency" >/dev/null
done

for required in "$MANIFEST" "$NARRATION"; do
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
  test -f "$capture_path"
  dimensions="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$capture_path")"
  test "$dimensions" = "1920x1080"

  narration_text="$(awk -v target="$scene_index" '
    BEGIN { RS=""; ORS="" }
    NR == target { gsub(/\n/, " "); print; exit }
  ' "$NARRATION")"
  /usr/bin/say -v Samantha -r 155 -o "$AUDIO_DIR/$scene_id.aiff" -- "$narration_text"
  actual_duration="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$AUDIO_DIR/$scene_id.aiff")"
  if awk -v actual="$actual_duration" -v allowed="$duration" 'BEGIN { exit !(actual > allowed) }'; then
    printf 'scene %s narration duration %.3fs exceeds scene %ss\n' "$scene_id" "$actual_duration" "$duration" >&2
    exit 1
  fi
  ffmpeg -nostdin -y -loglevel error \
    -i "$AUDIO_DIR/$scene_id.aiff" \
    -af "apad=pad_dur=$duration" -t "$duration" -ar 48000 -ac 2 \
    -c:a pcm_s16le "$audio_path"

  frames=$((duration * 30))
  video_filter="zoompan=z='min(1+0.00018*on,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30"

  ffmpeg -nostdin -y -loglevel error \
    -loop 1 -framerate 30 -i "$capture_path" \
    -i "$audio_path" \
    -vf "$video_filter" \
    -frames:v "$frames" -shortest \
    -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 \
    -c:a aac -b:a 192k -ar 48000 \
    "$scene_path"

  printf "file '%s'\n" "$scene_path" >> "$concat_file"
done < "$MANIFEST"

ffmpeg -nostdin -y -loglevel error \
  -f concat -safe 0 -i "$concat_file" \
  -c copy -movflags +faststart "$OUTPUT_VIDEO"

ffmpeg -nostdin -v error -i "$OUTPUT_VIDEO" -f null -
test "$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,pix_fmt -of csv=p=0 "$OUTPUT_VIDEO")" = "h264,1920,1080,yuv420p"
test "$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate -of csv=p=0 "$OUTPUT_VIDEO")" = "aac,48000"

ffmpeg -nostdin -y -loglevel error \
  -i "$CAPTURE_DIR/landing.png" -frames:v 1 "$OUTPUT_THUMBNAIL"

printf '%s\n%s\n' "$OUTPUT_VIDEO" "$OUTPUT_THUMBNAIL"
