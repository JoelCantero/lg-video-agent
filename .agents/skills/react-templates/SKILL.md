---
name: react-templates
description: 'Use when selecting, creating original templates, adding, or theming React or Remotion animation templates, including Locomotion templates, text animations, headlines, Spring Scale In, scripture quotes, narrated verses, complementary comparisons, negation-to-affirmation reveals, lens and partial reveals, concept equations, key questions, name cards, scene sweep transitions, word-by-word captions, starry-sky backgrounds, and the original or ELG theme presets.'
---

# React Templates

Use this catalog to select and adapt the React animation templates supplied by the user. Templates are grouped by category in folders relative to this skill.

## Optional Resources, Not A Design System

Design the narrative and scene composition before consulting the catalog. There is no required template count or coverage; use none if an original scene serves the idea better, unless the user explicitly requires a specific template. Creating a video authorizes project-specific original graphics without a separate request for each component.

Keep one-off illustrations and scenes in the consuming project's source, not in the shared catalog. They may reuse its font loader without inheriting its card geometry, type scale or motion presets. The template contract and import-fidelity rules below apply to catalog components, not to every graphic in the video. If a template's preserved layout or animation conflicts with the scene, choose another resource or create an original scene; do not force the narrative into it or modify the shared library to fit.

## Catalog

The template mapping is maintained in [the catalog](./catalog.md), not in this file.

## Use a Template

1. Read [the catalog](./catalog.md) and use each template's category, description, and tags to select the template matching the requested effect.
2. Read and use the local TSX source code linked directly from the catalog when available. Otherwise, follow the source URL and use the requested style.
3. Obtain the source code from the provider or the user before adapting it. If it is unavailable or requires access, ask the user for the code. Do not present a guessed implementation as the original template.
4. Check the provider's license and usage terms before copying code. Preserve any required attribution.
5. Use the single local component with its optional `theme` prop. Read [the shared contract and presets](./theme.ts); omit `theme` or pass `templatePresets.original` for provider-default styling. For Esglesia la Garriga content, load the project's `elg-brand` skill and pass `templatePresets.elg`. Do not create separate original and branded component copies.
6. Customize the shared theme tokens rather than hardcoding a new style in each component. Merge partial `motion` overrides with the chosen preset's `motion`; explicit legacy `textColor` and `bgColor` props take precedence over the theme. Keep content props independent of styling.
   New imported layouts use `resolveTemplateAppearance` to preserve provider geometry and type scale while changing fonts and palette. The generic composition preset is not permission to resize cards or replace their animation. Follow [the import workflow](../import-templates/SKILL.md) for fidelity checks.
	Text-only headlines use `textHeadingScale` independently of explainer typography. Gradient Text and Bold Text Punch preserve their signature effects by default; set `motion.preserveEffects: false` when the campaign requires gentle brand motion. Use `accentTextMix` to keep animated text readable and the inverse palette tokens for dark templates. These template-specific adaptations do not change the general `elg-brand` guidelines.
7. Components import [the local font loader](./fonts.ts), which waits for packaged Urbanist and Open Sans before rendering. Keep these dependencies when reusing a component and preserve their SIL OFL notices in distributions. Additional font families must be packaged and loaded by the consuming project.
8. Run `npm run resources:build` and `node --experimental-strip-types --test .agents/skills/react-templates/theme.test.mjs` (Node 22.6+), then preview original and ELG entrances and settled states. Check contrast, safe margins and reading time; extend the composition when content grows. Report any verification that could not be performed.

## Add a Template

When the user requests an original template rather than an import, implement
one reusable component using the shared appearance/font contract. Record
LG Video Agent as provider, the local source path, authored description/tags
and original-project provenance; do not invent a third-party URL or license.
Original is the neutral local design, not a provider baseline. Verify both
presets, light/dark palettes, frame-driven states and landscape/portrait
layouts. Keep content and editorial timing props separate from the theme.
Source-baseline import gates below apply to third-party imports, not newly
authored components.

Before importing, load [Import Templates](../import-templates/SKILL.md). Its source-baseline and visual-fidelity gates are required; a passing build alone is insufficient.

1. Open the URL or source supplied by the user and verify the template name, original description, category, tags, and selected style.
2. When source code is available and its license permits copying, save one component at `./<category>/<template-slug>.tsx`. Parameterize it with the shared `ThemedTemplateProps`, `resolveTemplateAppearance`, and font loader, preserving provider defaults, geometry and motion. Use `text`, `explainer` or `quotes` as appropriate; only create another category when needed.
3. Record the name, provider, source URL, selected style, license, original tags, and original description verbatim in [the catalog](./catalog.md) under the matching category. Do not invent tags if the provider does not list any. Clearly distinguish additional usage notes from the original description.
4. Link directly to the local TSX source code from the catalog. If source code is unavailable, mark it as not saved instead of adding a broken local link. Do not create a separate Markdown file per template or add template entries to `SKILL.md`.
5. Mark modified local code as adapted, retain its provider URL and license, and do not claim it is an unmodified source snapshot. Verify the skill frontmatter and confirm that each local reference resolves to an existing file.

Keep template metadata in the catalog and each template's source code in its own TSX file so the agent only loads the selected implementation.