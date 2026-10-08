---
name: narrative-beats
description: "Use when planning graphics or a Remotion edit from narrated audio or a reviewed transcript. Identify narrative beats, ideas, questions, contrasts and conclusions; create a timestamp-linked beats.json before composing visuals. Trigger also for beats narratius, mapa de beats, ritme narratiu and elements grafics sincronitzats."
---

# Narrative Beats

## Activation And Order

Use this skill to turn narration into a visual edit. A beat is a unit of meaning
that may warrant graphics, not every sentence, word, volume peak or musical beat.

Required order: audio -> transcription -> review against the user's narration
text -> beat map -> Remotion composition. The user supplies the narration text;
if missing, request it before marking the transcript reviewed or creating the map.
Do not assume the script matches the spoken words exactly.

Reuse a reviewed transcript of the current audio without rerunning Whisper.
Otherwise, read `.agents/skills/mlx-whisper/SKILL.md` from the repository root
and apply it. Respect explicit requests not to transcribe or to use another engine.
Without timestamps, propose untimed textual beats only; never invent timing.

## Workflow

1. Identify the reviewed captions, reference text and matching audio. Confirm
  which text discrepancies the user has resolved. Preserve originals and review
  notes; never fill omissions with invented word timestamps. Resolve discrepancies
  affecting beats before proceeding.
2. Divide the speech by narrative function: opening, question, assertion, example,
  explanation, contrast, quotation, conclusion or invitation. Preserve order,
  meaning and nuance; never invent facts, data, quotations or intentions.
3. Link each beat to a caption entry range and an anchor entry. Entries may be
  fragments or multiword blocks. Derive timing from captions, not reading speed.
4. Choose a visual purpose before selecting a template: introduce an object,
  build an explanation, compare, connect ideas or hold the scene. Not every beat
  needs animation. Preserve continuity between related beats rather than
  replacing the whole scene at every sentence.
  Define the object or relationship, initial state, internal reveals and
  resolution. Changing a headline does not explain a process. Long explanations
  need meaningful evolution or a justified hold, not periodic cuts or constant
  decorative animation. Choose framing, scale, hierarchy and rhythm by narrative
  purpose, not a grid or template. Original illustrations and mechanisms are
  normal options; the catalog is optional. Captions anchor speech and cues, not
  a mandatory heading or a cut at each entry.
5. Save `beats.json` beside the reviewed captions, separate from originals.
  Visual cues are proposed editorial decisions: they may precede an anchor or
  persist through a pause, but never change speech timing. Preserve user edits
  before replacing a reviewed map.
6. Listen in the preview to review pauses, emphasis, intonation, readability and
  graphic entrances/exits. Text supports semantic analysis, not verified prosody;
  timestamp gaps only suggest pauses. If listening is unavailable, keep
  `audioVerified: false` and report the limitation. Text approval does not verify
  alignment or prosody.
7. Present the map for review before composing. Keep `status: proposed` until
  editorial review. `reviewed` does not imply `audioVerified: true`; track them
  separately.
8. Apply `elg-brand` and, when selecting templates, `react-templates`. Convert
  seconds to frames using the actual Remotion fps; apply the same offset to
  audio, captions and beats. Run `npm run build` after code changes and check
  the beginning, middle and end in preview. For a new or rejected direction,
  build a complete narrative excerpt as a pilot before the rest. Validate it
  with `remotion-verify`; a beat map does not approve design or motion.

## beats.json Contract

Fictional example, not timing for any real narration:

```json
{
  "version": 1,
  "sourceCaptions": "captions-reviewed.json",
  "timeUnit": "seconds",
  "status": "proposed",
  "audioVerified": false,
  "beats": [
    {
      "id": "question-01",
      "type": "question",
      "idea": "The speech's central question",
      "entryRange": {"start": 0, "endExclusive": 4},
      "anchorEntry": 2,
      "start": 0.2,
      "end": 2.4,
      "visual": {
        "intent": "Highlight the question while keeping the scene",
        "action": "reveal",
        "enter": 0.2,
        "exit": 2.8
      },
      "reviewNotes": ["Fictional example timing; real maps must use reviewed captions and be checked against audio"]
    }
  ]
}
```

- `sourceCaptions` is relative to the map and identifies the reviewed version.
- `entryRange` uses zero-based indices; `endExclusive` is excluded.
- `anchorEntry` must be within the range. `start` is the first entry's `start`;
  `end` is the maximum `end` among included entries.
- `visual.action` is `reveal`, `update`, `hold` or `transition`.
- `visual.enter` and `visual.exit` bound graphic presence, not speech.
  Visual overlaps must be intentional and documented in `reviewNotes`.
- New maps use `visual.subject`, `visual.initialState` and `visual.resolution`
  to describe what appears and how the idea develops. These additional editorial
  fields do not invalidate existing maps.
- `visual.continuityKey` may identify a shared object between beats.
  `visual.cues` may contain `{anchorEntry, at, action, description}` for internal
  reveals, connections, text changes or transformations. `at` is video time in
  seconds with the beat's offset, not a local frame. Each cue states whether it
  precedes or follows its anchor; it never alters speech.
- Cues must be ordered, within `visual.enter..visual.exit`, and use valid reviewed
  caption anchors. Identify and justify adjacent-beat anchors used for continuity.
- Never add unsupported quantities, quotations or scientific relationships for
  dynamism. Distinguish visual metaphors from factual explanations.

## Verification

- Check valid JSON, unique IDs and an existing source.
- Validate integer indices within `words`, nonempty ranges, anchors within their
  range and finite nonnegative times, with `end > start` and `exit > enter`.
- Verify narrative times derive from referenced entries, beats are ordered and
  cues stay within the known duration.
- Do not use a zero-duration entry as an anchor without reviewing it.
- Revalidate after caption or audio changes; indices may shift. Never change
  captions to fit a visual proposal.
- Distinguish semantic proposal, editorial review and auditory verification.
- Check internal cues, not just beat entrances/exits. Compare storyboard actions
  with actual frames; a list-only scene does not deliver an animated process.