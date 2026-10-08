---
name: import-templates
description: 'Use when importing React or Remotion templates, adding Locomotion template URLs, or adapting imported templates to ELG branding. Preserve original layout, typography scale and animation; verify source fidelity before applying appearance-only changes.'
---

# Import Templates

Import the provider's design, not a reinterpretation of it. ELG adaptation is an appearance change unless the user explicitly requests a redesign.

## Required Context

Read [React Templates](../react-templates/SKILL.md), its [catalog](../react-templates/catalog.md) and [shared theme contract](../react-templates/theme.ts). Load [ELG Brand](../elg-brand/SKILL.md) when applying ELG. Keep metadata in the existing catalog and one reusable TSX component per template; do not create per-template Markdown files or separate branded copies.

## Workflow

1. Retrieve the actual source for the exact requested style using the provider's source control. Record the original URL, description, tags, category and license. Do not reconstruct unavailable source from a screenshot.
2. Establish Original first. Keep an unmodified source baseline in a temporary work area for comparison, not another registered component. Record the canvas dimensions, fps, props and content used for the reference. Verify Original against that baseline before making brand changes. Source CSS pixels are not interchangeable with the provider's advertised video resolution.
3. Identify invariants: primary widths and splits, padding, gaps, alignment, avatars, media crop, font-size hierarchy, line heights, radii, borders, shadows and decorative marks. Also record animation delays, spring settings, transforms, opacity curves, counters, cursor cadence, rating and waveform behavior.
4. Parameterize appearance without rebuilding markup. Use `resolveTemplateAppearance(theme, providerDefaults)` for new imports. Map Urbanist/Open Sans and palette tokens to the correct semantic roles. Keep quote ornaments and media geometry intact. Load packaged fonts and images; record any fallback or asset substitution.
5. Preserve motion with `templateEffectProgress` and the exact provider delays/configuration, or leave the provider's frame math intact. Do not change distances, spring timing, counters or signatures just because the brand preset has `motion.kind: 'gentle'`. A deliberately restrained version requires an explicit user request.
6. Register the category and component in the existing catalog. Retain provider metadata even if the user chooses a different local category. Keep hover-only playback, code inspection and shared Original/ELG plus Clar/Fosc controls.
7. Run the gates below and repair the first mismatch before importing the next batch. Compare actual renders, not just helper functions. Do not report fidelity merely because the build passes or nothing overflows.

## Appearance Versus Geometry

Allowed by default: brand font families/weights, text colors, semantic surface colors and accent treatment consistent with the user's requested preview mode.

Protected by default: font sizes and their hierarchy, line heights, widths/heights, padding, gaps, aspect ratios, media crop, radii, border widths, positioning, shadows, motion parameters and reading time.

The brand's 88/42/32 sizes at reference width 1920 and 8% margins describe new compositions. Do not blindly impose them on a provider's 22px quote inside a 620px card. Do not branch layout on `referenceWidth`, the selected preset, font family or color. Geometry belongs to the template.

The existing Text gradient and large-headline adjustments were explicitly requested by the user. Do not remove them during imports or propagate them to Quotes/Explainer without another request. A layout redesign must be described as such and approved, not hidden inside theme plumbing.

## Validation Gates

- Run `node --experimental-strip-types --test .agents/skills/react-templates/theme.test.mjs` and `npm run resources:build`.
- Compare provider baseline versus local Original at identical dimensions, fps, props, content and frames. Check early/mid/settled frames such as 0, 10, 25, 45 and 90. Screenshots from differently sized canvases are not a valid comparison.
- Compare Original versus ELG in both preview modes. Measure actual primary width, padding, font sizes, line heights, radii, media split and crop; these must retain their source values unless an explicit exception was requested. Font metrics may change wrapping slightly, but missing regions, doubled type or a different hierarchy fail the check.
- Check animation transforms and opacity at matching frames, not just the settled state. A spring equality test of a helper does not prove every component uses it correctly.
- Inspect screenshots on desktop and mobile, card and expanded views, with fonts loaded. Confirm source inspection, filtering, hover start/pause and preview switching still work. Verify packaged media also renders in the standalone HTML without external requests.
- Check text contrast on its actual surface, not only on a different solid palette token. Preserve user-authorized gradient exceptions and report them; do not invent a backplate or change layout to hide a contrast issue.
- If browser timing is unreliable in a hidden tab, use bounded fixed-frame captures. Never rely on unbounded `requestAnimationFrame`. Record unverified checks honestly.

## Stop Conditions

Stop and report the limitation if source/license/assets are unavailable, the reference dimensions cannot be established, or a fidelity check cannot be completed. Do not substitute guessed code or claim pixel-identical rendering when fonts/media differ.

## Completion

Summarize imported templates, approved appearance changes, fidelity checks performed and any remaining differences. Preserve the original design first; improving readability or redesigning the composition is a separate decision.