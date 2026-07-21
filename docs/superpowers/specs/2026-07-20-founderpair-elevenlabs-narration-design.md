# FoundPair ElevenLabs Narration Design

## Goal

Create a second Devpost-ready FoundPair demo video that keeps the approved 61-second visuals and burned-in captions but replaces the macOS system narration with ElevenLabs text-to-speech.

## Approved defaults

- Preserve all seven scenes, claims, captions, ordering, and durations.
- Use a warm, clear, professional English stock voice available to the supplied ElevenLabs account.
- Prefer the ElevenLabs text-to-speech endpoint with `eleven_multilingual_v2` and MP3 output.
- Generate each narration paragraph separately so timing failures can be identified per scene.
- Never print, write, or commit the API key; consume it only from `ELEVENLABS_API_KEY`.
- Preserve `/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo.mp4` and create `/Users/athifshaffy/Desktop/FoundPair-Devpost-Demo-ElevenLabs.mp4`.

## Alternatives considered

1. **Stock voice text-to-speech — selected.** Lowest complexity, good quality, and direct control over each scene.
2. **Designed custom voice.** More distinctive but consumes extra credits and introduces another approval decision.
3. **Speech-to-speech from the Samantha track.** Preserves cadence but adds conversion artifacts and unnecessary processing.

## Architecture and data flow

`video/render_video_elevenlabs.sh` reads the existing scene manifest and narration paragraphs. It requests one MP3 per scene, measures duration, fails before encoding if narration would be truncated, pads compliant audio to the scene duration, reuses the existing final captioned frames, renders seven scene clips, and concatenates them into a separate Desktop MP4.

The script accepts `ELEVENLABS_VOICE_ID` as an override. Otherwise the selected stock voice ID is passed explicitly by the caller after querying the authenticated voices endpoint.

## Failure handling and verification

- Fail clearly if the API key or voice ID is absent.
- Fail on HTTP errors without displaying authorization headers.
- Fail if any generated narration exceeds its allotted scene duration.
- Verify seven narration files, H.264 1920×1080 `yuv420p`, AAC 48 kHz audio, 60–80 second duration, complete decode, and no silence of 2.5 seconds or more.
- Run the existing 36 application tests, build, and lint before completion.

## Security

The API key is runtime-only and excluded from Git and generated files. Because it was pasted into chat, it should be rotated after rendering.
