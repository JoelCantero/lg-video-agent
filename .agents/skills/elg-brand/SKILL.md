---
name: elg-brand
description: "Església la Garriga Brand: apply the brand identity to videos, graphics, presentations, and social media content. Use when choosing typography, colors, gradients, layouts, imagery, motion, or brand tone."
---

# Església la Garriga Brand

Status: the colors, primary gradient, and typography below are specified by the user, who has also supplied the logo assets listed below. Other brand assets and guidelines remain pending validation; do not claim the entire identity is officially approved.

This skill is the reference for the brand's visual style. Edit brand decisions here. Explicit campaign instructions may adapt them; do not change the permanent identity without confirmation.

## Identity And Art Direction

Keep the specified colors, exact gradient, packaged font families and canonical logo. These identity constraints do not prescribe a layout, white background, object scale, camera or animation vocabulary. The campaign's narrative and inspected visual reference guide those choices. Calm is a tone, not a requirement for small objects, sparse scenes or weak movement. Composition and motion guidance below is a starting point, not a ban on expressive storytelling.

## Usage Procedure

1. Identify the format, audience, and campaign-specific instructions.
2. Apply the identity, typography, palette, and composition guidelines below. These take precedence over the agent's general visual preferences.
3. Check the availability and usage rights of fonts, logos, images, and audio. Do not present pending proposals as official decisions.
4. Validate readability, contrast, safe margins, and, for video, reading time at the final viewing size.
5. Report campaign adaptations and decisions still awaiting confirmation.

## Identity

- Display name: **Església la Garriga**. Preserve the accents and capitalization.
- Personality: approachable, welcoming, calm, and contemporary.
- Tone: warm and sincere, with brief messages in Catalan and clear invitations.
- Avoid excessive solemnity, spectacular effects, and grandiose promotional language.

## Typography

| Use | Family | Weight | Guidelines |
| --- | --- | --- | --- |
| Headlines and highlighted phrases | [Urbanist](https://fonts.google.com/specimen/Urbanist?preview.script=Latn) | Bold (700) | Generous spacing and no more than two lines |
| Body text, dates, and supporting information | [Open Sans](https://fonts.google.com/specimen/Open+Sans) | Regular (400) / Bold (700) | Clear text; use bold for emphasis and avoid long uppercase passages |
| Speech captions | Open Sans | Regular (400) / Bold (700) | No more than two lines on a background with stable contrast |

- Line height: 1.1 for headlines; 1.35 for body text. Letter spacing: 0.
- Reference sizes for 1920 x 1080: headlines 88 px, body text 42 px, secondary information 32 px, and speech captions 44 px. Adjust for text length and validate readability at the final viewing size.
- Adapt the composition for vertical formats; do not simply crop the horizontal version.
- Load font files before rendering. Do not depend on fonts installed on the computer.
- Check font licenses and Catalan character support before including them. If unavailable, report the limitation and use sans-serif only as a temporary fallback.

## Colors

| Token | Value | Use |
| --- | --- | --- |
| `primary` | `linear-gradient(to right, #3f7376 50%, #659b92 100%)` | Primary brand gradient for identity elements, backgrounds, and closing scenes |
| `base` | `#ffffff` | Base color for backgrounds and light surfaces |
| `contrast` | `#12180c` | Contrast color for text and dark elements |

- Choose base, contrast or the primary gradient as surfaces according to the campaign. A gradient-led sequence may span several scenes when it supports continuity; neither a white canvas nor alternating backgrounds is mandatory.
- `contrast` on `base` is a reliable text combination, not a required visual direction. The reverse combination is suitable for dark surfaces.
- Target at least 4.5:1 contrast for text. Verify new combinations, especially over photographs and gradients, at every position occupied by text throughout the animation.
- Do not assume either white or contrast-colored text meets this target across the entire primary gradient. If a combination fails, place essential text on a solid `base` surface with `contrast` text, or a solid `contrast` surface with `base` text.

## Primary Gradient

Use this exact gradient, preserving its direction and stops:

```css
linear-gradient(to right, #3f7376 50%, #659b92 100%)
```

The first color remains constant through 50% of the width, then transitions to the second color at 100%. Avoid additional multicolor gradients, decorative radial lights, and metallic effects. Maintain text contrast throughout the animation.

## Logo Assets

Use the user-provided SVG assets in this skill's `assets/` directory. Paths below are relative to this `SKILL.md`, not the repository root.

| Asset | File | Use |
| --- | --- | --- |
| Logo | [elg-logo.svg](assets/elg-logo.svg) | Full brand logo |
| Monochrome logo | [elg-logo-monochrome.svg](assets/elg-logo-monochrome.svg) | Full logo for single-color layouts |
| Icon | [elg-icon.svg](assets/elg-icon.svg) | Compact brand symbol |
| Monochrome icon | [elg-icon-monochrome.svg](assets/elg-icon-monochrome.svg) | Compact symbol for single-color layouts |

- Canonical location: `.agents/skills/elg-brand/assets/` from the repository root. 
- Inspect the selected variant against its background and preserve its original colors, proportions, and SVG viewBox. Do not recreate the logo or icon from scratch.
- When using these assets in Remotion, serve them through the project's public assets directory or an existing supported asset pipeline; skill-relative paths are not automatically browser URLs.

## Composition and Imagery

- Keep essential text, captions and identifying logo content inside safe margins of at least 8% of the canvas, with extra space for social interfaces. Illustrations and scenery may extend beyond the frame for close-ups when their important features remain understandable.
- Give each scene a clear narrative purpose. A headline, supporting text or invitation is optional; an object, process, relationship or verse can lead the scene without a separate heading. Choose framing and hierarchy per scene, not one fixed headline/graphic/caption grid.
- Use real community photographs or videos, natural light, and recognizable people only with appropriate permissions.
- Use the supplied logo assets for brand identification. Do not invent a replacement logo or present stock footage as the church.
- Do not stretch, recolor, or animate parts of the logo without an authorized version.

## Motion and Audio

- Choose timing and easing from the narrated action and reference. Entrances of 12 to 18 frames at 30 fps are a starting point for simple text, not a limit on processes, camera moves or transitions.
- Allow camera moves, close-ups, morphs, cutaways, kinetic text and controlled elastic accents when they clarify meaning. Calm and welcoming does not mean fade-only or static. Avoid harmful flashing, disorienting motion and effects that compromise reading; animate deterministically using Remotion frames, not real-time CSS transitions.
- Keep informational cards visible for at least 3 seconds, extending the duration according to the amount of text.
- Speech must take priority over music. Use licensed audio and provide captions for voiceovers.

## Pending Confirmation

- Any additional logo variants and usage restrictions not covered by the supplied assets.
- Availability and licenses of the specified font files.
- Photographs, image permissions, and available music.
- Usual formats: horizontal 16:9, vertical 9:16, or square 1:1.