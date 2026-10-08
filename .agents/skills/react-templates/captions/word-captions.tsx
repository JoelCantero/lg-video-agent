import { Fragment } from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

// Same shape as `Caption` from @remotion/captions.
type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
  pageBreakAfter?: boolean;
};

type Props = ThemedTemplateProps & {
  captions?: Caption[];
  maxCharsPerPage?: number;
  pauseBreakMs?: number;
  hiddenRanges?: ReadonlyArray<readonly [number, number]>;
  offsetSeconds?: number;
};

type Token = { text: string; startMs: number; endMs: number; first: number; breakAfter: boolean };

const HOLD_MS = 700;
const FADE_MS = 160;
const PUNCTUATION = /[.,;:!?…]["»”’')]*$/;
const SENTENCE_END = /[.:;!?…]["»”’')]*$/;

// Illustrative English sample with editorial timings, not a transcription.
const sampleCaptions: Caption[] = ([
  [' Isn’t', 500, 800], [' science', 800, 1250], [' what', 1250, 1400], [' we', 1400, 1520], [' can', 1520, 1700],
  [' observe,', 1700, 2250], [' measure', 2400, 2800], [' and', 2800, 2950], [' prove,', 2950, 3500], [' while', 4000, 4300],
  [' faith', 4300, 4650], [' means', 4650, 4950], [' believing', 4950, 5450], [' without', 5450, 5800], [' proof?', 5800, 6400],
] as Array<[string, number, number]>).map(([text, startMs, endMs]) => ({ text, startMs, endMs, timestampMs: null, confidence: null }));

const textLength = (tokens: Token[]) => tokens.reduce((sum, token, index) => sum + token.text.length + (index > 0 ? 1 : 0), 0);

// Halve long phrases recursively, preferring balanced halves that end on punctuation.
function splitPhrase(tokens: Token[], maxChars: number): Token[][] {
  const total = textLength(tokens);
  if (tokens.length < 2 || total <= maxChars) return [tokens];
  let best = 1;
  let bestCost = Infinity;
  for (let index = 1; index < tokens.length; index++) {
    const balance = Math.abs(textLength(tokens.slice(0, index)) - textLength(tokens.slice(index))) / total;
    const cost = balance + (PUNCTUATION.test(tokens[index - 1].text) ? 0 : 0.35);
    if (cost < bestCost) {
      best = index;
      bestCost = cost;
    }
  }
  return [...splitPhrase(tokens.slice(0, best), maxChars), ...splitPhrase(tokens.slice(best), maxChars)];
}

function paginate(captions: Caption[], maxChars: number, pauseBreakMs: number, hiddenRanges: ReadonlyArray<readonly [number, number]>) {
  const rangeOf = (index: number) => hiddenRanges.findIndex(([first, last]) => index >= first && index <= last);
  const tokens: Token[] = [];
  captions.forEach((caption, index) => {
    const previous = tokens[tokens.length - 1];
    if (previous && !caption.text.startsWith(' ') && !previous.breakAfter && rangeOf(previous.first) === rangeOf(index)) {
      previous.text += caption.text;
      previous.endMs = Math.max(previous.endMs, caption.endMs);
      previous.breakAfter = Boolean(caption.pageBreakAfter);
    } else {
      tokens.push({ text: caption.text.trim(), startMs: caption.startMs, endMs: caption.endMs, first: index, breakAfter: Boolean(caption.pageBreakAfter) });
    }
  });
  const phrases: Token[][] = [];
  tokens.forEach((token, index) => {
    const previous = tokens[index - 1];
    if (!previous || previous.breakAfter || SENTENCE_END.test(previous.text) || token.startMs - previous.endMs >= pauseBreakMs
      || rangeOf(previous.first) !== rangeOf(token.first)) phrases.push([token]);
    else phrases[phrases.length - 1].push(token);
  });
  const chunks = phrases.flatMap(phrase => splitPhrase(phrase, maxChars));
  return chunks.map((tokensOfPage, index) => {
    const startMs = tokensOfPage[0].startMs;
    const nextStart = chunks[index + 1]?.[0].startMs ?? Infinity;
    const hideAtMs = Math.min(nextStart, Math.max(...tokensOfPage.map(token => token.endMs)) + HOLD_MS);
    return { tokens: tokensOfPage, startMs, hideAtMs, continues: hideAtMs >= nextStart, hidden: rangeOf(tokensOfPage[0].first) >= 0 };
  });
}

function luminance(color: string): number {
  const channels = (interpolateColors(0, [0, 1], [color, color]).match(/[\d.]+/g) ?? []).slice(0, 3).map(value => {
    const channel = Number(value) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

const contrast = (first: string, second: string) => {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
};

export function WordCaptions({
  theme, captions = sampleCaptions, maxCharsPerPage, pauseBreakMs = 400, hiddenRanges = [], offsetSeconds = 0,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 25, bodySize: 25, secondarySize: 18,
    headingLineHeight: 1.1, bodyLineHeight: 1.3, borderRadius: 15, safeMargin: 0.08,
  });
  // Captions use Open Sans Bold, so wait for that weight instead of Regular.
  useTemplateFonts({ ...appearance, bodyWeight: 700 });
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const pages = paginate(captions, maxCharsPerPage ?? (portrait ? 52 : 70), pauseBreakMs, hiddenRanges);
  const ms = (frame / fps + offsetSeconds) * 1000;
  const index = pages.findIndex(page => !page.hidden && ms >= page.startMs && ms < page.hideAtMs);
  const page = pages[index];
  const plate = appearance.inverseBackground;
  const plateText = appearance.inverseTextColor;
  const accent = appearance.accentColors.find(color => contrast(color, plateText) >= 4.5 && contrast(color, plate) >= 3);
  const enter = page ? interpolate(ms, [page.startMs, page.startMs + FADE_MS], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1),
  }) : 0;
  const exit = page && !page.continues ? interpolate(ms, [page.hideAtMs - FADE_MS, page.hideAtMs], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }) : 1;

  return <AbsoluteFill data-template="word-captions" style={{ background: appearance.background, boxSizing: 'border-box',
    justifyContent: 'flex-end', alignItems: 'center', padding: `0 ${width * 0.08}px ${height * (portrait ? 0.19 : 0.1)}px` }}>
    {page && <div data-page={index} style={{ maxWidth: '100%', boxSizing: 'border-box',
      padding: `${9 * scale}px ${17 * scale}px ${10 * scale}px`, borderRadius: 15 * scale, background: plate, color: plateText,
      fontFamily: appearance.bodyFont, fontWeight: 700, fontSize: (portrait ? 25 : 22) * scale, lineHeight: 1.3, letterSpacing: 0,
      textAlign: 'center', textWrap: 'balance', overflowWrap: 'anywhere',
      opacity: Math.min(enter, exit), translate: `0px ${(1 - enter) * 9 * scale}px` }}>
      {page.tokens.map((token, tokenIndex) => {
        const active = ms >= token.startMs && ms < token.endMs;
        return <Fragment key={tokenIndex}>{tokenIndex > 0 ? ' ' : null}<span data-word={tokenIndex} data-active={active} style={{
          borderRadius: 6 * scale, padding: `0 ${4 * scale}px`, margin: `0 ${-4 * scale}px`,
          background: active ? accent ?? plateText : 'transparent', color: active && !accent ? plate : undefined,
          opacity: ms >= token.startMs ? 1 : 0.55,
        }}>{token.text}</span></Fragment>;
      })}
    </div>}
  </AbsoluteFill>;
}
