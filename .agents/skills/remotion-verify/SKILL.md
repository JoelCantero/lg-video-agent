---
name: remotion-verify
description: "Use when verifying a Remotion composition, reviewing rendered video, or preparing a final export. Render representative frames, inspect readability, assets, transitions and captions, review audio synchronization, fix and recheck before delivery. Trigger also for verificacio visual, revisar video, fotogrames, sincronitzacio and exportacio final."
---

# Remotion Verify

## Activation And Scope

Apply after creating or changing a composition, before claiming verification.
For exports, also check the final file. Do not render a video when the request
only covers transcription, beat planning or skill edits. A preview request
does not authorize a full export.

Narrated video order: audio -> transcription -> review against the user's text
-> beats -> composition -> verification -> delivery. Generate the requested
final export during verification; never deliver a different, uninspected render.

`npm run build` checks TypeScript, not images, readability, motion or audio.
Captures and metadata do not prove auditory synchronization. Approval of the
narration text does not approve timestamps.

## Art Direction Pilot

For a new direction, demanding reference or rejected result, first implement a
pilot scene with a complete progression, voice and captions where applicable.
An attractive still or animated entrance is insufficient. Open the preview;
review object, process and resolution in motion. Compare equivalent states with
the reference at the same viewing size, not an empty entrance with a mature scene.

Assess graphic presence and quality, hierarchy, clear relationships, visible
progression, rhythm and continuity as well as readability. Support conclusions
with concrete observations and evidence, not capture counts, changed-pixel
percentages or lack of overlap. No template quota; import fidelity does not
establish editing quality.

Seek user approval of the direction before extending the pilot to the full edit,
unless explicitly delegated. If inspection or playback is unavailable, deliver
the pilot for human review and mark direction pending. Generated samples do not
imply approval. Pilot test renders do not authorize an unrequested full export.

## Preparation

1. Identify the actual entrypoint (`src/index.tsx` here), composition ID, props,
  assets, fps, dimensions, duration and audio offset. Use effective render values,
  including calculated metadata. Keep preview, still and export settings identical.
2. Load `elg-brand` for ELG content. For reused templates, follow `react-templates`
  and `import-templates` fidelity checks. This skill neither replaces them nor
  authorizes changes to template geometry or animation.
3. Run `npm run build` after Remotion code changes and the tests required by
  affected skills. Fix introduced errors before proceeding; type checks do not
  establish visual quality.
4. Save captures and reports in a new `.cache/verification/<run-id>/` directory.
  Never reuse old captures or overwrite user files. Do not publish private audio
  or evidence without authorization.

## Visual Sampling

- With `beats.json`, sample each beat's entrance, readable state and exit, plus
  frames before, during and after transitions and caption group changes.
  Apply the video's temporal offset.
- Without beats, use actual scene and animation intervals. Include beginning,
  middle, end, long sentences, Catalan accents, logos and media.
- Convert seconds using `Math.round(seconds * fps)`, clamp to
  `0..durationInFrames - 1` and deduplicate. Never use a fixed frame list
  independent of duration, fps and content.
- Capture with `remotion still`, replacing ID, frame and path with actual values:

  ```sh
  npx --no-install remotion still src/index.tsx CompositionId .cache/verification/run-id/frame-42.png --frame=42
  ```

  Create the directory first. Frame 42 is only an example. Pass identical
  `--props` to all commands when using custom props. Use the local CLI; inform
  the user before installing packages or downloading browsers. If the available
  browser cannot render, report the blocker instead of substituting old captures.
- Open and inspect captures with the available image tool. Generating them
  without looking is not visual verification. Hidden preview tabs may stall
  playback; prefer fixed-frame renders to indefinite waits.

## Visual And Motion Checks

- Complete text without clipping or overlap; hierarchy, safe margins and contrast
  on the actual background, appropriate to the brand and destination platform.
- Loaded fonts, correct accents, faithful logos and nonempty, working assets.
- Sufficient reading time and composition suited to the final format. Desktop
  captures do not prove mobile readability; inspect at consumption size.
- Elements absent before entrance and after exit where appropriate; transitions
  without flashes, jumps, unintended blank scenes or truncated cues.
- Readable caption groups, correct active word and no highlight held through
  silence. Pay special attention to zero-duration entries and estimated timing.
- Play motion excerpts in preview; stills do not prove fluency. Assess whether
  camera, elasticity, textures or background changes explain the idea. Neither
  impose them as decoration nor reject them merely for being expressive.

## Audio And Export

1. With narration, listen to beginning, middle, end and risky beat/caption points.
   Check synchronization, pauses, no cuts and speech priority over music. Never
   trim or accelerate audio to fit without authorization. If listening is
   unavailable, mark it pending.
2. When export is requested, render the actual ID with identical props and the
   agreed preset to a new path. Do not blindly use `npm run render`: it targets
   a specific composition, not any newly created one.
3. If available, use `ffprobe` to check final dimensions, duration, streams and
   fps against expected settings. Missing audio is valid only if none is expected.
4. If available, use `ffmpeg` to extract and inspect final-video samples at selected
   times. This checks the encoded result, not just React:

   ```sh
   ffmpeg -n -v error -ss 1.5 -i out/video.mp4 -frames:v 1 .cache/verification/run-id/encoded-1.png
   ```

  Time and paths are examples. Do not extract at the exact endpoint. Also play
  excerpts of the exported file with audio where applicable. If tools or playback
  are unavailable, report incomplete verification; correct stills do not fully
  validate the final file.
5. Fix defects, rerender affected samples and inspect again. After edit or audio
  changes, repeat affected timing checks. A changed final render is not validated
  by evidence from the previous version.

## Report And Delivery

Save `verification.json` with composition, props, fps, dimensions, duration,
export path if any, sample times/frames and evidence paths, executed commands,
fixed issues and pending checks. For pilots, also record `artDirection` with
status, tested excerpt, compared reference, evidence, observations and user
approval or explicit delegation. This extra field does not invalidate old reports.
Script approval and technical tests do not approve art direction.

For `visual`, `motion`, `audio` and `encodedOutput`, use `passed`, `pending`,
`failed` or `notApplicable`, with reasons and evidence. `audio` is `notApplicable`
only when no audio is expected; `encodedOutput` only when no export was requested.
A report records verification; it is not an automatic quality test.

Never claim full verification with errors or required checks pending. You may
deliver an explicitly provisional proposal with its limitations. Report the
output path and actual checks without claiming to have heard or inspected
material you have not reviewed.