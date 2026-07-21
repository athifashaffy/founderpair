#!/bin/bash
set -euo pipefail
set +x

: "${ELEVENLABS_API_KEY:?ELEVENLABS_API_KEY is required}"
: "${ELEVENLABS_VOICE_ID:?ELEVENLABS_VOICE_ID is required}"

REPO_ROOT="$(git rev-parse --show-toplevel)"
BUILD_DIR="$REPO_ROOT/.video-build/elevenlabs"
CAPTURE_DIR="$REPO_ROOT/.video-build/captures"
SCENE_DIR="$BUILD_DIR/scenes"
AUDIO_DIR="$BUILD_DIR/audio"
REQUEST_DIR="$BUILD_DIR/requests"
MANIFEST="$REPO_ROOT/video/scenes.tsv"
NARRATION="$REPO_ROOT/video/narration.txt"
OUTPUT_VIDEO="/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo-ElevenLabs.mp4"
OUTPUT_THUMBNAIL="/Users/athifshaffy/Desktop/FoundPair-Devpost-Thumbnail-ElevenLabs.png"
OUTPUT_VIDEO_PART="/Users/athifshaffy/Desktop/.FoundPair-Devpost-Demo-ElevenLabs.part.mp4"
OUTPUT_THUMBNAIL_PART="/Users/athifshaffy/Desktop/.FoundPair-Devpost-Thumbnail-ElevenLabs.part.png"

mkdir -p "$SCENE_DIR" "$AUDIO_DIR" "$REQUEST_DIR"

for dependency in curl ffmpeg ffprobe jq awk; do
  command -v "$dependency" >/dev/null
done

scene_count="$(awk -F '\t' 'NR > 1 { count += 1 } END { print count + 0 }' "$MANIFEST")"
narration_count="$(awk 'BEGIN { RS="" } NF { count += 1 } END { print count + 0 }' "$NARRATION")"
test "$scene_count" = "7"
test "$narration_count" = "$scene_count"

concat_file="$BUILD_DIR/scene-list.txt"
: > "$concat_file"

scene_index=0
while IFS=$'\t' read -r scene_id duration capture heading short_caption; do
  test "$scene_id" = "id" && continue
  scene_index=$((scene_index + 1))

  capture_path="$CAPTURE_DIR/$capture"
  mp3_path="$AUDIO_DIR/$scene_id.mp3"
  mp3_part_path="$mp3_path.part"
  request_path="$REQUEST_DIR/$scene_id.json"
  wav_path="$AUDIO_DIR/$scene_id.wav"
  scene_path="$SCENE_DIR/$scene_id.mp4"

  test -f "$capture_path"
  test "$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$capture_path")" = "1920x1080"

  narration_text="$(awk -v target="$scene_index" '
    BEGIN { RS=""; ORS="" }
    NR == target { gsub(/\n/, " "); print; exit }
  ' "$NARRATION")"

  voice_speed=1.1
  case "$scene_id" in
    04|06) voice_speed=0.9 ;;
  esac

  request_body="$(jq -n --arg text "$narration_text" --argjson speed "$voice_speed" '{
    text: $text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.55,
      similarity_boost: 0.78,
      style: 0.18,
      use_speaker_boost: true,
      speed: $speed
    }
  }')"
  printf '%s' "$request_body" > "$request_path"

  printf 'header = "xi-api-key: %s"\n' "$ELEVENLABS_API_KEY" | curl \
    --config - \
    --fail-with-body --silent --show-error \
    --request POST \
    --url "https://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_VOICE_ID?output_format=mp3_44100_128" \
    --header "Accept: audio/mpeg" \
    --header "Content-Type: application/json" \
    --data-binary "@$request_path" \
    --output "$mp3_part_path"

  actual_duration="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$mp3_part_path")"
  if awk -v actual="$actual_duration" -v allowed="$duration" 'BEGIN { exit !(actual > allowed) }'; then
    printf 'scene %s narration duration %.3fs exceeds scene %ss\n' "$scene_id" "$actual_duration" "$duration" >&2
    exit 1
  fi
  mv -- "$mp3_part_path" "$mp3_path"

  ffmpeg -nostdin -y -loglevel error \
    -i "$mp3_path" -af "apad=pad_dur=$duration" -t "$duration" \
    -ar 48000 -ac 2 -c:a pcm_s16le "$wav_path"

  frames=$((duration * 30))
  video_filter="zoompan=z='min(1+0.00018*on,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30"

  ffmpeg -nostdin -y -loglevel error \
    -loop 1 -framerate 30 -i "$capture_path" -i "$wav_path" \
    -vf "$video_filter" -frames:v "$frames" -shortest \
    -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 \
    -c:a aac -b:a 192k -ar 48000 "$scene_path"

  printf "file '%s'\n" "$scene_path" >> "$concat_file"
done < "$MANIFEST"

ffmpeg -nostdin -y -loglevel error \
  -f concat -safe 0 -i "$concat_file" \
  -c copy -movflags +faststart "$OUTPUT_VIDEO_PART"

ffmpeg -nostdin -v error -i "$OUTPUT_VIDEO_PART" -f null -
test "$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,pix_fmt -of csv=p=0 "$OUTPUT_VIDEO_PART")" = "h264,1920,1080,yuv420p"
test "$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate -of csv=p=0 "$OUTPUT_VIDEO_PART")" = "aac,48000"
mv -- "$OUTPUT_VIDEO_PART" "$OUTPUT_VIDEO"

ffmpeg -nostdin -y -loglevel error \
  -i "$CAPTURE_DIR/landing.png" -frames:v 1 "$OUTPUT_THUMBNAIL_PART"
test "$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$OUTPUT_THUMBNAIL_PART")" = "1920x1080"
mv -- "$OUTPUT_THUMBNAIL_PART" "$OUTPUT_THUMBNAIL"

printf '%s\n%s\n' "$OUTPUT_VIDEO" "$OUTPUT_THUMBNAIL"
