import { interpolateColors } from 'remotion';
import type { TemplateThemeInput } from '../theme';

export function diagramFill(theme: TemplateThemeInput | undefined, original: string): string {
  const colors = theme?.accentColors;
  if (!colors?.length) return original;
  if (colors.length === 1) return colors[0];
  const level = parseInt(original.slice(1, 3), 16) / 255;
  return interpolateColors(level, colors.map((_, index) => index / (colors.length - 1)), colors);
}