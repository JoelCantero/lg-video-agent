import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { parse } from 'parse5';
import ts from 'typescript';
import * as templateTheme from './theme.ts';
import { diagramFill } from './diagram/appearance.ts';
import { Easing, interpolateColors, spring } from 'remotion';
import { entranceProgress, resolveTemplateAppearance, resolveTemplateTheme, scaleThemeSize, templateCanvasStyle, templateEffectProgress, templateHeadingStyle, templatePreviewTheme, textHeadingSize, templatePresets } from './theme.ts';

test('original project templates reveal complementary meaning and preserve complete scripture passages', () => {
  const require = createRequire(import.meta.url);
  function render(slug, frame, config, props = {}) {
    const source = readFileSync(new URL(`./${slug}.tsx`, import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
    } }).outputText;
    const exports = {};
    new Function('require', 'exports', compiled)(name => {
      if (name === '../theme') return templateTheme;
      if (name === '../fonts') return { useTemplateFonts() {} };
      if (name === 'lucide-react') return { Atom: 'atom-icon', Coffee: 'cup-icon', Plus: 'plus-icon', Quote: 'quote-icon' };
      if (name === 'remotion') return { ...require(name), AbsoluteFill: 'absolute-fill',
        useCurrentFrame: () => frame, useVideoConfig: () => config };
      return require(name);
    }, exports);
    return Object.values(exports)[0](props);
  }
  function find(element, attribute, value) {
    if (Array.isArray(element)) return element.flatMap(child => find(child, attribute, value));
    if (!element || typeof element !== 'object') return [];
    return [...(element.props?.[attribute] === value ? [element] : []), ...find(element.props?.children, attribute, value)];
  }
  for (const fps of [30, 60]) for (const [width, height] of [[960, 540], [1080, 1920]]) {
    const config = { width, height, fps, durationInFrames: fps * 60 };
    for (const preset of ['original', 'elg']) for (const dark of [false, true]) {
      const props = { theme: templatePreviewTheme(preset, dark, 'Explainer') };
      const early = render('explainer/complementary-panels', Math.round(fps * 0.55), config, props);
      assert.equal(find(early, 'data-panel', 0)[0].props.style.opacity, 1);
      assert.equal(find(early, 'data-panel', 1)[0].props.style.opacity, 0);
      assert.equal(find(early, 'data-connection', true)[0].props.style.opacity, 0);
      const settled = render('explainer/complementary-panels', fps * 3, config, props);
      assert.equal(find(settled, 'data-connection', true)[0].props.style.opacity, 1);
      assert.equal(find(settled, 'data-panels', true)[0].props.style.gridTemplateColumns, height > width ? '1fr' : '1fr 1fr');
      const text = 'Un text llarg amb accents catalans que conserva totes les paraules i la referència. '.repeat(7).trim();
      const scriptureProps = { text, reference: 'Referència aportada', theme: templatePreviewTheme(preset, dark, 'Quotes') };
      const first = render('quotes/scripture-reference', fps, config, scriptureProps);
      const count = Number(find(first, 'data-page', true)[0].props.children[2]);
      const actual = [];
      for (let index = 0; index < count; index++) {
        const tree = render('quotes/scripture-reference', (index * 8 + 1) * fps, config, scriptureProps);
        actual.push(find(tree, 'data-passage', index)[0].props.children);
      }
      assert.equal(actual.join(' '), text);
      assert.throws(() => render('quotes/scripture-reference', 0, { ...config, durationInFrames: fps * 3 }, scriptureProps), /needs at least/);
      assert.throws(() => render('quotes/scripture-reference', 0, config, { secondsPerPassage: 0 }), /at least 3 seconds/);
    }
  }
});

test('original preset preserves template-specific defaults', () => {
  const theme = resolveTemplateTheme(templatePresets.original, { headingSize: 72, textColor: '#000' });
  assert.equal(theme.headingSize, 72);
  assert.equal(theme.textColor, '#000');
  assert.equal(theme.motion.kind, 'original');
});

test('preview light mode preserves provider defaults and ELG styling', () => {
  for (const preset of ['original', 'elg']) {
    assert.deepEqual(templatePreviewTheme(preset, false), templatePresets[preset]);
  }
});

test('ELG light text previews use the exact accent gradient without changing other modes or categories', () => {
  const saved = structuredClone(templatePresets);
  const theme = resolveTemplateTheme(templatePreviewTheme('elg', false, 'Text'));
  assert.equal(theme.headingBackground, saved.elg.accentBackground);
  assert.equal(theme.background, '#ffffff');
  assert.equal(theme.accentTextMix, 1);
  assert.deepEqual(theme.motion, resolveTemplateTheme(saved.elg).motion);
  assert.equal(theme.headingFont, saved.elg.headingFont);
  assert.deepEqual(templateHeadingStyle(theme), {
    backgroundImage: saved.elg.accentBackground,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  });
  for (const [preset, dark, category] of [
    ['elg', true, 'Text'], ['elg', false, 'Explainer'], ['original', false, 'Text'], ['original', true, 'Text'],
  ]) {
    const unchanged = resolveTemplateTheme(templatePreviewTheme(preset, dark, category));
    assert.equal(unchanged.headingBackground, undefined);
    assert.deepEqual(templateHeadingStyle(unchanged), { color: unchanged.textColor });
  }
  assert.deepEqual(templatePresets, saved);
});

test('preview dark mode changes only the palette without mutating presets', () => {
  const saved = structuredClone(templatePresets);
  for (const preset of ['original', 'elg']) {
    const componentDefaults = { headingSize: 72, headingWeight: 800, background: '#fafafa' };
    const light = resolveTemplateTheme(templatePreviewTheme(preset, false), componentDefaults);
    const dark = resolveTemplateTheme(templatePreviewTheme(preset, true), componentDefaults);
    assert.equal(dark.background, preset === 'elg' ? light.accentBackground : light.inverseBackground);
    assert.equal(templateCanvasStyle(dark, 960, 540).background, dark.background);
    assert.equal(dark.textColor, light.inverseTextColor);
    assert.equal(dark.cardBackground, light.inverseBackground);
    assert.equal(dark.positiveColor, dark.textColor);
    for (const key of ['headingFont', 'bodyFont', 'headingSize', 'headingWeight', 'textHeadingScale', 'safeMargin', 'motion', 'accentBackground', 'inverseTextColor']) {
      assert.deepEqual(dark[key], light[key], key);
    }
  }
  assert.deepEqual(templatePresets, saved);
  assert.equal(templatePreviewTheme('elg', true).accentBackground, saved.elg.accentBackground);
  assert.equal(templatePreviewTheme('original', true).accentBackground, undefined);
});

test('ELG overrides typography, palette, spacing, and motion', () => {
  const theme = resolveTemplateTheme(templatePresets.elg, { textColor: '#ffffff', background: '#171717' });
  assert.equal(theme.headingFont, 'Urbanist, sans-serif');
  assert.equal(theme.bodyFont, 'Open Sans, sans-serif');
  assert.equal(theme.textColor, '#12180c');
  assert.equal(theme.background, '#ffffff');
  assert.equal(theme.headingWeight, 700);
  assert.equal(theme.letterSpacing, 0);
  assert.equal(theme.safeMargin, 0.08);
  assert.equal(theme.motion.blinkCursor, false);
  assert.equal(theme.accentBackground, 'linear-gradient(to right, #3f7376 50%, #659b92 100%)');
});

test('partial custom themes merge nested motion without mutating presets', () => {
  const theme = resolveTemplateTheme({ ...templatePresets.elg, textColor: '#224466', motion: { ...templatePresets.elg.motion, durationFrames: 18 } });
  assert.equal(theme.textColor, '#224466');
  assert.equal(theme.motion.kind, 'gentle');
  assert.equal(theme.motion.durationFrames, 18);
  assert.equal(theme.motion.blinkCursor, false);
  assert.equal(templatePresets.elg.textColor, '#12180c');
});

test('gentle motion is monotonic, bounded, and settles after 16 frames at 30fps', () => {
  const theme = resolveTemplateTheme(templatePresets.elg);
  let previous = 0;
  for (let frame = -5; frame <= 40; frame++) {
    const progress = entranceProgress(frame, 30, theme);
    assert.ok(progress >= 0 && progress <= 1);
    assert.ok(progress >= previous);
    previous = progress;
  }
  assert.equal(entranceProgress(0, 30, theme), 0);
  assert.equal(entranceProgress(16, 30, theme), 1);
  assert.equal(entranceProgress(32, 60, theme), 1);
  assert.equal(entranceProgress(15, 30, theme, 20), 0);
});

test('brand reference sizes scale to the composition width', () => {
  const theme = resolveTemplateTheme(templatePresets.elg);
  assert.equal(scaleThemeSize(theme, theme.headingSize, 1920), 88);
  assert.equal(scaleThemeSize(theme, theme.headingSize, 960), 44);
  assert.equal(scaleThemeSize(resolveTemplateTheme(), 72, 960), 72);
});

test('text-only headlines stay prominent without enlarging explainer headings', () => {
  const theme = resolveTemplateTheme(templatePresets.elg);
  assert.equal(textHeadingSize(theme, 960), 88);
  assert.equal(textHeadingSize(theme, 1920), 176);
  assert.equal(scaleThemeSize(theme, theme.headingSize, 960), 44);
  assert.equal(textHeadingSize(resolveTemplateTheme({}, { headingSize: 100 }), 960), 100);
  assert.equal(textHeadingSize(resolveTemplateTheme({ ...templatePresets.elg, textHeadingScale: 1.5 }), 960), 66);
});

test('canvas margins follow both axes and remain inside its dimensions', () => {
  const theme = resolveTemplateTheme(templatePresets.elg);
  assert.equal(templateCanvasStyle(theme, 1920, 1080).padding, '86.4px 153.6px');
  assert.equal(templateCanvasStyle(theme, 1080, 1920).padding, '153.6px 86.4px');
  assert.equal(templateCanvasStyle(theme, 1080, 1920).boxSizing, 'border-box');
});

test('partial nested overrides keep the chosen preset motion defaults', () => {
  const theme = resolveTemplateTheme({ motion: { durationFrames: 18 } }, templatePresets.elg);
  assert.equal(theme.motion.kind, 'gentle');
  assert.equal(theme.motion.blinkCursor, false);
  assert.equal(entranceProgress(18, 30, theme), 1);
});

test('original and custom spring motion use the requested physics', () => {
  const original = resolveTemplateTheme();
  const config = { stiffness: 300, damping: 10 };
  assert.equal(entranceProgress(10, 30, original, 3, config), spring({ frame: 7, fps: 30, config }));
  const custom = resolveTemplateTheme({ motion: { kind: 'spring', stiffness: 120, damping: 22 } });
  assert.equal(entranceProgress(10, 30, custom), spring({ frame: 10, fps: 30, config: { stiffness: 120, damping: 22 } }));
  const punch = resolveTemplateTheme({ motion: { kind: 'punch' } });
  assert.equal(entranceProgress(10, 30, punch), spring({ frame: 10, fps: 30, config: { stiffness: 200, damping: 10 } }));
});

test('ELG retains signature effects without changing ordinary gentle entrances', () => {
  const theme = resolveTemplateTheme(templatePresets.elg);
  const config = { stiffness: 300, damping: 10 };
  assert.equal(templateEffectProgress(10, 30, theme, 0, config), spring({ frame: 10, fps: 30, config }));
  assert.notEqual(templateEffectProgress(10, 30, theme, 0, config), entranceProgress(10, 30, theme));
  const gentle = resolveTemplateTheme({ motion: { preserveEffects: false } }, templatePresets.elg);
  assert.equal(templateEffectProgress(10, 30, gentle, 0, config), entranceProgress(10, 30, gentle));
  const custom = resolveTemplateTheme({ motion: { kind: 'spring', damping: 25 } }, templatePresets.elg);
  assert.equal(templateEffectProgress(10, 30, custom, 0, config), entranceProgress(10, 30, custom));
  assert.equal(theme.inverseBackground, '#12180c');
  assert.equal(theme.inverseTextColor, '#ffffff');
});

test('Spring Scale In matches original scale and opacity physics in ELG at 30 and 60fps', () => {
  const original = resolveTemplateTheme(templatePresets.original);
  const elg = resolveTemplateTheme(templatePresets.elg);
  const scaleConfig = { stiffness: 200, damping: 12 };
  const opacityConfig = { stiffness: 300, damping: 20 };
  for (const fps of [30, 60]) {
    let overshoot = false;
    for (let frame = 0; frame <= 120; frame++) {
      const scale = templateEffectProgress(frame, fps, elg, 0, scaleConfig);
      assert.equal(scale, templateEffectProgress(frame, fps, original, 0, scaleConfig));
      assert.equal(templateEffectProgress(frame, fps, elg, 0, opacityConfig),
        templateEffectProgress(frame, fps, original, 0, opacityConfig));
      overshoot ||= scale > 1;
    }
    assert.ok(overshoot, 'The signature spring bounce must remain visible');
    assert.equal(templateEffectProgress(0, fps, elg, 0, scaleConfig), 0);
  }
});

test('imported appearance preserves layout and type scale instead of applying brand composition sizes', () => {
  const defaults = { headingSize: 22, bodySize: 16, secondarySize: 14, headingLineHeight: 1.6, borderRadius: 16 };
  const original = resolveTemplateAppearance(templatePresets.original, defaults);
  for (const dark of [false, true]) {
    const elg = resolveTemplateAppearance(templatePreviewTheme('elg', dark, 'Quotes'), defaults);
    for (const key of ['headingSize', 'bodySize', 'secondarySize', 'headingLineHeight', 'bodyLineHeight', 'referenceWidth', 'safeMargin', 'textHeadingScale', 'borderRadius', 'borderWidth']) {
      assert.deepEqual(elg[key], original[key], key);
    }
    assert.equal(scaleThemeSize(elg, elg.headingSize, 960), 22);
    assert.equal(elg.headingFont, 'Urbanist, sans-serif');
    assert.equal(elg.bodyFont, 'Open Sans, sans-serif');
    assert.equal(elg.background, dark ? templatePresets.elg.accentBackground : '#ffffff');
  }
});

test('all Quotes components use appearance-only themes and never branch layout on the brand reference width', () => {
  const templates = [
    ['quote-card', 480, 22, 13, 11], ['testimonial-card', 620, 22, 16, 14],
    ['social-post', 560, 16, 20, 14], ['profile-card', 480, 26, 16, 15],
    ['video-testimonial', 460, undefined, 22, 13],
  ];
  for (const [slug, width, headingSize, bodySize, secondarySize] of templates) {
    const source = readFileSync(new URL(`./quotes/${slug}.tsx`, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(`${slug}.tsx`, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const resolvers = [];
    const widths = [];
    function visit(node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'resolveTemplateAppearance') resolvers.push(node);
      if (ts.isPropertyAccessExpression(node)) assert.notEqual(node.name.text, 'referenceWidth', `${slug}: brand-dependent geometry`);
      if (ts.isPropertyAssignment(node) && node.name.getText(ast) === 'width') {
        const value = ts.isConditionalExpression(node.initializer) ? node.initializer.whenFalse : node.initializer;
        if (ts.isNumericLiteral(value)) widths.push(Number(value.text));
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
    assert.equal(resolvers.length, 1, `${slug}: use the appearance-only resolver`);
    assert.ok(widths.includes(width), `${slug}: preserve the provider's primary width`);
    const defaults = resolvers[0].arguments[1];
    assert.ok(ts.isObjectLiteralExpression(defaults));
    for (const [key, expected] of Object.entries({ headingSize, bodySize, secondarySize })) {
      if (expected === undefined) continue;
      const property = defaults.properties.find(node => ts.isPropertyAssignment(node) && node.name.getText(ast) === key);
      assert.ok(property && ts.isNumericLiteral(property.initializer), `${slug}: explicit ${key}`);
      assert.equal(Number(property.initializer.text), expected, `${slug}: original ${key}`);
    }
  }
});

test('rendered Quotes retain geometry, transforms and opacity across presets at fixed frames', () => {
  const require = createRequire(import.meta.url);
  const geometryKeys = new Set([
    'width', 'height', 'padding', 'paddingTop', 'margin', 'marginTop', 'marginBottom',
    'gap', 'fontSize', 'lineHeight', 'borderRadius', 'display', 'flexDirection',
    'position', 'top', 'right', 'bottom', 'left', 'opacity', 'transform',
  ]);
  function signature(element) {
    if (Array.isArray(element)) return element.map(signature);
    if (!element || typeof element !== 'object') return element;
    if (typeof element.type === 'function') return signature(element.type(element.props));
    return {
      type: element.type,
      style: Object.fromEntries(Object.entries(element.props.style ?? {}).filter(([key]) => geometryKeys.has(key))),
      children: signature(element.props.children),
    };
  }
  for (const slug of ['quote-card', 'testimonial-card', 'social-post', 'profile-card', 'video-testimonial']) {
    const source = readFileSync(new URL(`./quotes/${slug}.tsx`, import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
    } }).outputText;
    for (const fps of [30, 60]) for (const frame of [0, 10, 25, 45, 90]) {
      const exports = {};
      const templateRequire = name => {
        if (name === '../theme') return templateTheme;
        if (name === '../fonts') return { useTemplateFonts() {} };
        if (name.endsWith('.jpg')) return { default: 'sample.jpg' };
        if (name === 'remotion') return {
          ...require('remotion'), AbsoluteFill: 'absolute-fill', Img: 'img',
          useCurrentFrame: () => frame, useVideoConfig: () => ({ fps, width: 960, height: 540 }),
        };
        return require(name);
      };
      new Function('require', 'exports', compiled)(templateRequire, exports);
      const component = Object.values(exports).find(value => typeof value === 'function');
      assert.ok(component, `${slug}: exported component`);
      for (const dark of [false, true]) {
        const original = component({ theme: templatePreviewTheme('original', dark, 'Quotes') });
        const branded = component({ theme: templatePreviewTheme('elg', dark, 'Quotes') });
        assert.deepEqual(signature(branded), signature(original), `${slug}: fps=${fps}, frame=${frame}, dark=${dark}`);
      }
    }
  }
});

test('Diagram components preserve SVG geometry, layout and animation across presets', () => {
  const slugs = [
    'venn-diagram-2', 'venn-diagram-3', 'versus-split', 'comparison-matrix',
    'flowchart', 'cycle-diagram', 'org-chart', 'mind-map', 'pyramid-diagram',
    'concentric-circles', 'swot-analysis', 'pie-chart', 'line-chart', 'radar-chart',
    'gauge-meter', 'quadrant-chart',
  ];
  const require = createRequire(import.meta.url);
  const appearanceKeys = new Set(['fill', 'stroke', 'color', 'background', 'backgroundColor', 'fontFamily', 'fontWeight', 'letterSpacing']);
  const referenceKeys = new Set(['id', 'clipPath', 'markerEnd']);
  function signature(element, appearance = false) {
    if (Array.isArray(element)) return element.map(child => signature(child, appearance));
    if (!element || typeof element !== 'object') return element;
    if (typeof element.type === 'function') return signature(element.type(element.props), appearance);
    function properties(props) {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !referenceKeys.has(key) && (appearance || !appearanceKeys.has(key))).map(([key, value]) => {
        if (key === 'style') return [key, properties(value)];
        if (key === 'children') return [key, signature(value, appearance)];
        if (key === 'backgroundColor') return ['background', value];
        if (!appearance && key.startsWith('border') && typeof value === 'string') return [key, value.split(' ').slice(0, 2).join(' ')];
        return [key, value];
      }));
    }
    return { type: element.type, props: properties(element.props) };
  }
  function loadComponent(source, frame, fps) {
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
    } }).outputText;
    const exports = {};
    const templateRequire = name => {
      if (name === '../theme') return templateTheme;
      if (name === '../fonts') return { useTemplateFonts() {} };
      if (name === './appearance') return { diagramFill };
      if (name === 'react') return { ...require('react'), useId: () => 'fidelity-test' };
      if (name === 'remotion') return {
        ...require('remotion'), AbsoluteFill: 'absolute-fill',
        useCurrentFrame: () => frame, useVideoConfig: () => ({ fps, width: 960, height: 540 }),
      };
      return require(name);
    };
    new Function('require', 'exports', compiled)(templateRequire, exports);
    return Object.values(exports).find(value => typeof value === 'function');
  }
  const baselines = process.env.LG_DIAGRAM_BASELINE
    ? JSON.parse(readFileSync(process.env.LG_DIAGRAM_BASELINE, 'utf8')) : undefined;
  if (baselines) assert.equal(baselines.length, slugs.length);
  for (const slug of slugs) {
    const source = readFileSync(new URL(`./diagram/${slug}.tsx`, import.meta.url), 'utf8');
    assert.ok(source.includes('resolveTemplateAppearance'), `${slug}: appearance-only theme`);
    assert.ok(!source.includes('referenceWidth'), `${slug}: no brand-based resizing`);
    for (const fps of [30, 60]) for (const frame of [0, 10, 25, 45, 90]) {
      const component = loadComponent(source, frame, fps);
      assert.ok(component, `${slug}: exported component`);
      if (baselines) {
        const baseline = baselines.find(record => record.slug === slug);
        assert.ok(baseline, `${slug}: original source captured`);
        const provider = loadComponent(baseline.code, frame, fps);
        assert.deepEqual(signature(component({}), true), signature(provider({}), true), `${slug}: provider fidelity, fps=${fps}, frame=${frame}`);
      }
      for (const dark of [false, true]) {
        const original = component({ theme: templatePreviewTheme('original', dark, 'Diagram') });
        const branded = component({ theme: templatePreviewTheme('elg', dark, 'Diagram') });
        assert.deepEqual(signature(branded), signature(original), `${slug}: geometry and motion, fps=${fps}, frame=${frame}, dark=${dark}`);
        if (slug === 'gauge-meter') {
          const palette = templatePreviewTheme('elg', dark, 'Diagram');
          const originalSvg = original.props.children.props.children;
          assert.equal(originalSvg.props.children[0].props.stroke, dark ? '#737373' : '#e5e5e5', 'Keep Original track colors unchanged');
          assert.equal(originalSvg.props.children[6].props.fill, '#a3a3a3', 'Keep Original labels unchanged');
          assert.equal(originalSvg.props.children[7].props.fill, dark ? '#a3a3a3' : '#d4d4d4', 'Keep Original limits unchanged');
          const [track, valueArc, needle, , , value, label, minimum, maximum] = branded.props.children.props.children.props.children;
          assert.equal(track.props.stroke, `color-mix(in srgb, ${palette.borderColor} 16%, transparent)`);
          assert.notEqual(track.props.stroke, valueArc.props.stroke, 'The inactive track must not hide the filled value');
          assert.equal(valueArc.props.stroke, palette.textColor);
          assert.equal(needle.props.stroke, valueArc.props.stroke);
          assert.equal(value.props.fill, palette.textColor);
          for (const secondary of [label, minimum, maximum]) {
            assert.equal(secondary.props.fill, `color-mix(in srgb, ${palette.mutedColor} 65%, transparent)`);
            assert.notEqual(secondary.props.fill, value.props.fill, 'Keep secondary text separate from the value');
          }
          const custom = component({ theme: palette, textColor: '#b91c1c', value: '25' });
          assert.equal(custom.props.children.props.children.props.children[1].props.stroke, '#b91c1c', 'Preserve explicit value colors');
        }
      }
    }
  }
});

test('Logo Stroke Draw preserves provider timing and uses canonical ELG assets', () => {
  const require = createRequire(import.meta.url);
  const source = readFileSync(new URL('./logo/logo-stroke-draw.tsx', import.meta.url), 'utf8');
  const icon = JSON.parse(readFileSync(new URL('./logo/elg-icon-data.json', import.meta.url), 'utf8'));
  const wordmark = JSON.parse(readFileSync(new URL('./logo/elg-wordmark-data.json', import.meta.url), 'utf8'));
  const canonicalLogo = readFileSync(new URL('../elg-brand/assets/elg-logo.svg', import.meta.url), 'utf8');
  function letteringRecords(markup) {
    const records = [];
    function visit(node) {
      if (['g', 'path', 'rect', 'linearGradient', 'stop'].includes(node.tagName)
        && !node.attrs.some(attribute => attribute.value === 'fill:white;')) {
        records.push({tag: node.tagName, attrs: node.attrs});
      }
      for (const child of node.childNodes ?? []) visit(child);
    }
    visit(parse(markup.startsWith('<svg') ? markup : `<svg>${markup}</svg>`));
    return records;
  }
  assert.deepEqual(letteringRecords(wordmark.markup), letteringRecords(canonicalLogo.slice(canonicalLogo.indexOf('<svg'))), 'Preserve all original letter geometry, transforms and gradient attributes');
  assert.ok(!/<(?:image|use|metadata)\b/.test(wordmark.markup));
  const canonicalIcon = readFileSync(new URL('../elg-brand/assets/elg-icon.svg', import.meta.url), 'utf8');
  const pathData = canonicalIcon.match(/<path d="([^"]+)"/)[1];
  assert.ok(icon.markup.includes(pathData), 'Use the canonical vector path without redrawing');
  assert.ok(icon.markup.includes('pathLength="1"'));
  assert.ok(!icon.markup.includes('<metadata'));
  assert.equal(icon.viewBox, '0 0 512 512');
  const outlinePaths = [...icon.outlineMarkup.matchAll(/ d="([^"]+)"/g)].map(match => match[1]);
  assert.equal(outlinePaths.length, 7);
  assert.deepEqual(outlinePaths, require('@remotion/paths').getSubpaths(pathData), 'Normalize each original subpath individually so the visible draw lasts the full interval');
  assert.equal([...icon.outlineMarkup.matchAll(/pathLength="1"/g)].length, 7);
  const baseline = process.env.LG_LOGO_BASELINE
    ? JSON.parse(readFileSync(process.env.LG_LOGO_BASELINE, 'utf8')) : undefined;
  function load(code, frame, fps) {
    const compiled = ts.transpileModule(code, {compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022, esModuleInterop: true,
    }}).outputText;
    const exports = {};
    const templateRequire = name => {
      if (name === '../theme') return templateTheme;
      if (name === '../fonts') return {useTemplateFonts() {}};
      if (name === './elg-icon-data.json') return icon;
      if (name === './elg-wordmark-data.json') return wordmark;
      if (name === 'react') return {...require('react'), useId: () => 'logo-test'};
      if (name === 'remotion') return {...require('remotion'), Img: 'img',
        useCurrentFrame: () => frame, useVideoConfig: () => ({fps, width: 960, height: 540})};
      return require(name);
    };
    new Function('require', 'exports', compiled)(templateRequire, exports);
    return Object.values(exports).find(value => typeof value === 'function');
  }
  function signature(element) {
    if (Array.isArray(element)) return element.flatMap(child => {
      const result = signature(child); return Array.isArray(result) ? result : [result];
    });
    if (!element || typeof element !== 'object') return element;
    if (element.type === Symbol.for('react.fragment')) return signature(element.props.children);
    const props = Object.fromEntries(Object.entries(element.props).map(([key, value]) => {
      if (key === 'id') return [key, 'gradient'];
      if (key === 'fill' && String(value).startsWith('url(#')) return [key, 'url(#gradient)'];
      if (key === 'children') return [key, signature(value)];
      if (key === 'style') return [key, Object.fromEntries(Object.entries(value).map(([name, entry]) => [name === 'backgroundColor' ? 'background' : name, entry]))];
      return [key, value];
    }));
    return {type: element.type, props};
  }
  for (const fps of [30, 60]) for (const seconds of [0, 0.4, 0.8, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.9, 3 - 1 / fps, 3]) {
    const frame = Math.round(seconds * fps);
    const component = load(source, frame, fps);
    const original = component({});
    if (baseline) assert.deepEqual(signature(original), signature(load(baseline.code, frame, fps)()), `Original fidelity: ${fps}fps, ${seconds}s`);
    const caption = original.props.children.props.children[1];
    const expectedName = interpolateForTest(frame, [fps * 2, fps * 2.5]);
    assert.equal(caption.props.style.opacity, expectedName);
    for (const dark of [false, true]) {
      const branded = component({logo: 'elg', theme: templatePreviewTheme('elg', dark, 'Logo')});
      const [svg, brandedCaption] = branded.props.children.props.children;
      assert.equal(svg.props.viewBox, icon.viewBox);
      assert.equal(svg.props.width, '120');
      assert.equal(svg.props.height, '120');
      assert.equal(svg.props.style.flexShrink, 0);
      assert.equal(svg.props.style.opacity, undefined, 'The leaf stays visible when the name appears');
      const expectedDraw = 1 - interpolateForTest(frame, [0, fps * 1.4]);
      const expectedFill = Easing.inOut(Easing.cubic)(interpolateForTest(frame, [fps * 1.4, fps * 1.8]));
      const iconStyle = svg.props.children[0].props.children;
      assert.ok(iconStyle.includes(`stroke: ${dark ? '#ffffff' : 'url(#logo-fill-logo-test)'};`));
      assert.equal(iconStyle.includes('fill: #ffffff !important;'), dark, 'White artwork only in ELG dark mode; preserve canonical gradients in light mode');
      if (dark) assert.ok(iconStyle.includes('#logo-fill-logo-test-icon path, #logo-fill-logo-test-wordmark path, #logo-fill-logo-test-wordmark rect'));
      const actualDraw = Number(iconStyle.match(/stroke-dashoffset: ([^;]+);/)[1]);
      const actualFill = Number(iconStyle.match(/fill-opacity: ([^;]+);/)[1]);
      assert.ok(Math.abs(actualDraw - expectedDraw) < 1e-12, `ELG drawing: ${fps}fps, ${seconds}s`);
      assert.ok(Math.abs(actualFill - expectedFill) < 1e-12, `ELG fill: ${fps}fps, ${seconds}s`);
      assert.equal(svg.props.children[2].props.dangerouslySetInnerHTML.__html, icon.outlineMarkup);
      for (let index = 0; index < 7; index++) {
        const expectedStroke = 1 - Easing.inOut(Easing.quad)(interpolateForTest(frame, [fps * 0.1 * index, fps * (0.1 * index + 0.8)]));
        assert.ok(Math.abs(svg.props.style[`--elg-stroke-${index}`] - expectedStroke) < 1e-12, `Overlapping eased stroke ${index}: ${fps}fps, ${seconds}s`);
        assert.ok(icon.outlineMarkup.includes(`stroke-dashoffset:var(--elg-stroke-${index})`));
      }
      if (seconds === 0.4) {
        const moving = Array.from({length: 7}, (_, index) => svg.props.style[`--elg-stroke-${index}`]).filter(offset => offset > 0 && offset < 1);
        assert.ok(moving.length >= 3, 'Overlap multiple moving strokes to avoid stop-start drawing');
      }
      assert.equal(brandedCaption.type, 'svg', 'Use canonical vector lettering, not font-rendered text');
      assert.equal(brandedCaption.props.id, 'logo-fill-logo-test-wordmark');
      assert.equal(brandedCaption.props['aria-label'], 'Església la Garriga');
      assert.equal(brandedCaption.props.viewBox, wordmark.viewBox);
      assert.equal(brandedCaption.props.width, '240');
      const renderedLetters = brandedCaption.props.dangerouslySetInnerHTML.__html;
      assert.deepEqual(letteringRecords(renderedLetters.replace(/logo-fill-logo-test-wordmark-/g, '')), letteringRecords(wordmark.markup));
      assert.equal(brandedCaption.props.style.marginTop, caption.props.style.marginTop);
      assert.equal(brandedCaption.props.style.opacity, interpolateForTest(frame, [fps * 1.8, fps * 2.2]));
      if (seconds <= 1.8) assert.equal(brandedCaption.props.style.opacity, 0, 'The lettering waits until the leaf is drawn and filled');
      if (seconds >= 2.2) {
        assert.equal(actualDraw, 0);
        assert.equal(actualFill, 1);
        assert.equal(brandedCaption.props.style.opacity, 1, 'Hold the full logo for the final 0.8 seconds of the three-second clip');
        for (let index = 0; index < 7; index++) assert.equal(svg.props.style[`--elg-stroke-${index}`], 0);
      }
      const customized = component({companyName: 'Custom name'});
      assert.equal(customized.props.children.props.children[1].props.children, 'Custom name');
      assert.equal(branded.props.style.background, dark ? templatePresets.elg.accentBackground : '#ffffff');
    }
  }
  function interpolateForTest(frame, [start, end]) {
    return Math.max(0, Math.min(1, (frame - start) / (end - start)));
  }
});

test('Diagram series keep distinct palette tones without changing original colors', () => {
  const colors = ['#171717', '#525252', '#737373', '#a3a3a3', '#d4d4d4'];
  assert.deepEqual(colors.map(color => diagramFill(undefined, color)), colors);
  for (const dark of [false, true]) {
    const branded = colors.map(color => diagramFill(templatePreviewTheme('elg', dark, 'Diagram'), color));
    assert.equal(new Set(branded).size, colors.length);
  }
});

test('Quotes preserve provider spring timing and physics in Original and ELG', () => {
  const original = resolveTemplateTheme(templatePresets.original);
  const elg = resolveTemplateTheme(templatePresets.elg);
  const effects = [
    [0, 180, 18], [10, 200, 20], [25, 200, 20], [3, 160, 16], [12, 140, 18],
    [25, 200, 14], [30, 180, 16], [2, 180, 16], [10, 160, 18], [35, 300, 10],
    [6, 250, 12], [12, 180, 16], [20, 160, 18], [28, 200, 14], [6, 200, 14],
    [28, 180, 16], [5, 80, 18],
  ];
  for (const fps of [30, 60]) {
    for (const [delay, stiffness, damping] of effects) {
      const config = { stiffness, damping };
      for (const frame of [0, 5, 15, 30, 60, 90]) {
        const expected = spring({ frame: frame - delay, fps, config });
        assert.equal(templateEffectProgress(frame, fps, original, delay, config), expected);
        assert.equal(templateEffectProgress(frame, fps, elg, delay, config), expected);
      }
    }
  }
});

test('essential ELG text meets the 4.5:1 contrast target on solid surfaces', () => {
  const luminance = (color) => {
    const rgb = color.startsWith('#')
      ? color.slice(1).match(/.{2}/g).map(channel => parseInt(channel, 16))
      : color.match(/[\d.]+/g).slice(0, 3).map(Number);
    const channels = rgb.map(channel => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const contrast = (first, second) => (Math.max(luminance(first), luminance(second)) + 0.05) / (Math.min(luminance(first), luminance(second)) + 0.05);
  for (const dark of [false, true]) {
    const theme = resolveTemplateTheme(templatePreviewTheme('elg', dark));
    const background = dark ? theme.cardBackground : theme.background;
    for (const color of [theme.textColor, theme.mutedColor, theme.negativeColor, theme.positiveColor]) {
      assert.ok(contrast(background, color) >= 4.5);
    }
    for (const accent of theme.accentColors) {
      for (let progress = 0; progress <= theme.accentTextMix; progress += 0.1) {
        const color = interpolateColors(progress, [0, 1], [theme.textColor, accent]);
        assert.ok(contrast(background, color) >= 4.5);
      }
    }
    assert.ok(contrast(theme.inverseTextColor, theme.inverseBackground) >= 4.5);
  }
});

const requireFromTests = createRequire(import.meta.url);
const renderState = { frame: 0, config: {} };
const renderedTemplates = new Map();
function render(slug, frame, config, props) {
  if (!renderedTemplates.has(slug)) {
    const source = readFileSync(new URL(`./${slug}.tsx`, import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
    } }).outputText;
    const exports = {};
    new Function('require', 'exports', compiled)(name => {
      if (name === '../theme') return templateTheme;
      if (name === '../fonts') return { useTemplateFonts() {} };
      if (name === 'remotion') return { ...requireFromTests(name), AbsoluteFill: 'absolute-fill',
        useCurrentFrame: () => renderState.frame, useVideoConfig: () => renderState.config };
      return requireFromTests(name);
    }, exports);
    renderedTemplates.set(slug, Object.values(exports)[0]);
  }
  Object.assign(renderState, { frame, config });
  return renderedTemplates.get(slug)(props);
}
function find(element, attribute, value) {
  if (Array.isArray(element)) return element.flatMap(child => find(child, attribute, value));
  if (!element || typeof element !== 'object') return [];
  const actual = element.props?.[attribute];
  const matches = typeof value === 'function' ? actual !== undefined && value(actual) : actual === value;
  return [...(matches ? [element] : []), ...find(element.props?.children, attribute, value)];
}
const text = element => Array.isArray(element) ? element.map(text).join('')
  : element && typeof element === 'object' ? text(element.props?.children)
  : element === null || element === undefined || typeof element === 'boolean' ? '' : String(element);
const luminance = color => {
  const rgb = color.startsWith('#')
    ? color.slice(1).match(/.{2}/g).map(channel => parseInt(channel, 16))
    : color.match(/[\d.]+/g).slice(0, 3).map(Number);
  const channels = rgb.map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
const contrast = (first, second) => (Math.max(luminance(first), luminance(second)) + 0.05) / (Math.min(luminance(first), luminance(second)) + 0.05);
const any = () => true;

test('original narrative templates keep their cues, cover the cut and caption only spoken words', () => {
  const sample = 'Isn’t science what we can observe, measure and prove, while faith means believing without proof?';
  const custom = [[' God', 0, 200], ['\'s', 200, 600], [' work', 600, 800, true], [' is', 800, 1000], [' good.', 1000, 1200], [' Very', 1300, 1500], [' good.', 1500, 1900]]
    .map(([text, startMs, endMs, pageBreakAfter]) => ({ text, startMs, endMs, timestampMs: null, confidence: null, pageBreakAfter }));

  for (const fps of [30, 60]) for (const [width, height] of [[960, 540], [1080, 1920]]) {
    const config = { width, height, fps, durationInFrames: fps * 8 };
    const at = (slug, seconds, props) => render(slug, Math.round(seconds * fps), config, props);
    for (const preset of ['original', 'elg']) for (const dark of [false, true]) {
      const themed = category => ({ theme: templatePreviewTheme(preset, dark, category) });

      const negation = { ...themed('Explainer'), negation: 'A sentence with a quote: “no longer needed”' };
      assert.equal(find(at('explainer/negation-to-affirmation', 0.3, negation), 'data-word', 0)[0].props.style.opacity, 0);
      assert.equal(find(at('explainer/negation-to-affirmation', 2.5, negation), 'data-strike', true).length, 0);
      const struck = at('explainer/negation-to-affirmation', 3, negation);
      const words = find(struck, 'data-word', any);
      assert.equal(words.map(text).join(' '), negation.negation, 'Every negation word is kept in order');
      assert.ok(words.every(word => word.props.style.opacity === 1));
      assert.equal(find(struck, 'data-strike', true)[0].props.style.width, '106%');
      assert.equal(find(struck, 'data-turn', true).length, 0, 'The struck negation holds before the turn');
      const turning = at('explainer/negation-to-affirmation', 4.35, negation);
      assert.equal(find(turning, 'data-negation', true).length, 0, 'The negation has fallen away');
      assert.equal(find(turning, 'data-turn', true).length, 1);
      const resolved = at('explainer/negation-to-affirmation', 7, negation);
      assert.equal(find(resolved, 'data-turn', true).length, 0);
      const affirmation = find(resolved, 'data-affirmation', true)[0];
      assert.equal(affirmation.props.style.opacity, 1);
      assert.match(text(affirmation), /^On the contrary/);
      assert.ok(contrast(affirmation.props.children[1].props.style.color, affirmation.props.style.background) >= 4.5);
      assert.throws(() => at('explainer/negation-to-affirmation', 1, { ...negation, wordSeconds: [0.1] }), /one time per negation word \(8\)/);
      const timed = at('explainer/negation-to-affirmation', 1, { ...negation, wordSeconds: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 2, 3] });
      assert.equal(find(timed, 'data-word', 5)[0].props.style.opacity, 1);
      assert.equal(find(timed, 'data-word', 6)[0].props.style.opacity, 0);

      const card = { ...themed('Quotes'), name: 'Isaac Newton', role: 'The law of gravity' };
      const entering = at('quotes/name-card', 0, card);
      assert.equal(find(entering, 'data-name', true)[0].props.style.clipPath, 'inset(0 100% 0 0)');
      assert.equal(find(entering, 'data-role', true)[0].props.style.opacity, 0);
      const named = at('quotes/name-card', 3, card);
      const name = find(named, 'data-name', true)[0];
      assert.equal(name.props.style.clipPath, 'inset(0 0% 0 0)');
      assert.equal(text(name), 'Isaac Newton');
      assert.equal(find(named, 'data-role', true)[0].props.style.opacity, 1);
      assert.ok(contrast(name.props.style.color, resolveTemplateTheme(card.theme).cardBackground) >= 4.5);
      assert.equal(at('quotes/name-card', 3, { ...card, placement: 'lower-third' }).props.style.justifyContent, 'flex-end');

      const sweep = themed('Transition');
      const cut = Math.round(config.durationInFrames / 2);
      assert.equal(find(render('transition/scene-sweep', cut - 1, config, sweep), 'data-scene', 'before').length, 1);
      assert.equal(find(render('transition/scene-sweep', cut, config, sweep), 'data-scene', 'after').length, 1);
      for (const frame of [0, cut - Math.round(fps * 0.3), cut + Math.round(fps * 0.3), config.durationInFrames - 1]) {
        assert.equal(find(render('transition/scene-sweep', frame, config, sweep), 'data-band', any).length, 0, `No bands outside the sweep (${frame})`);
      }
      for (const direction of ['left-to-right', 'right-to-left']) {
        const main = find(render('transition/scene-sweep', cut, config, { ...sweep, direction }), 'data-band', 'main')[0].props.style;
        const angle = Number.parseFloat(main.rotate) * Math.PI / 180;
        const halfWidth = main.width / (2 * Math.cos(angle));
        for (const y of [0, height]) {
          const center = main.left + main.width / 2 - (y - height / 2) * Math.tan(angle);
          assert.ok(center - halfWidth <= 0 && center + halfWidth >= width, `The main band covers row ${y} at the cut (${direction})`);
        }
      }
      const slots = { ...sweep, before: 'A', after: 'B', cutSeconds: 2 };
      assert.equal(text(find(render('transition/scene-sweep', 2 * fps - 1, config, slots), 'data-scene', 'before')[0]), 'A');
      assert.equal(text(find(render('transition/scene-sweep', 2 * fps, config, slots), 'data-scene', 'after')[0]), 'B');

      const captions = themed('Captions');
      const poster = at('captions/word-captions', 3, captions);
      const active = find(poster, 'data-active', true);
      assert.equal(active.length, 1);
      assert.equal(text(active[0]), 'prove,');
      const plate = find(poster, 'data-page', any)[0].props.style;
      const chip = active[0].props.style;
      assert.ok(contrast(chip.background, chip.color ?? plate.color) >= 4.5, 'Readable highlighted word');
      assert.ok(contrast(chip.background, plate.background) >= 3, 'The highlight stands out from the plate');
      if (preset === 'elg') assert.equal(chip.background, '#3f7376');
      assert.equal(text(find(at('captions/word-captions', 0, { ...captions, offsetSeconds: 3 }), 'data-active', true)[0]), 'prove,');
      const pause = at('captions/word-captions', 3.7, captions);
      assert.equal(find(pause, 'data-page', any).length, 1, 'The page stays through a short pause');
      assert.equal(find(pause, 'data-active', true).length, 0, 'No highlight during silence');
      const pages = [];
      for (let seconds = 0; seconds <= 9; seconds += 0.05) {
        const page = find(at('captions/word-captions', seconds, captions), 'data-page', any)[0];
        if (page && page.props['data-page'] !== pages.at(-1)?.index) pages.push({ index: page.props['data-page'], text: text(page) });
      }
      assert.equal(pages.map(page => page.text).join(' '), sample, 'Every caption word appears once, in order');
      assert.ok(pages.every(page => page.text.length <= (height > width ? 52 : 70)));
      const withCustom = { ...captions, captions: custom };
      assert.equal(text(find(at('captions/word-captions', 0.3, withCustom), 'data-page', 0)[0]), 'God\'s work');
      assert.equal(text(find(at('captions/word-captions', 0.9, withCustom), 'data-page', 1)[0]), 'is good.');
      assert.equal(text(find(at('captions/word-captions', 1.4, withCustom), 'data-page', 2)[0]), 'Very good.');
      assert.equal(find(at('captions/word-captions', 0.3, { ...withCustom, hiddenRanges: [[0, 2]] }), 'data-page', any).length, 0);
      assert.equal(text(find(at('captions/word-captions', 0.9, { ...withCustom, hiddenRanges: [[0, 2]] }), 'data-page', 1)[0]), 'is good.');
    }
  }
});

test('more original templates from the video keep literal text, editorial cues and readable surfaces', () => {
  const verseText = 'The heavens declare the glory of God; and the firmament sheweth his handywork.';
  for (const fps of [30, 60]) for (const [width, height] of [[960, 540], [1080, 1920]]) {
    const config = { width, height, fps, durationInFrames: fps * 8 };
    const at = (slug, seconds, props) => render(slug, Math.round(seconds * fps), config, props);
    const portrait = height > width;
    const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
    for (const preset of ['original', 'elg']) for (const dark of [false, true]) {
      const themed = category => ({ theme: templatePreviewTheme(preset, dark, category) });

      const verse = themed('Quotes');
      assert.equal(find(at('quotes/narrated-verse', 0, verse), 'data-reference', true).length, 0);
      const reading = at('quotes/narrated-verse', 3, verse);
      const reference = find(reading, 'data-reference', true)[0];
      assert.equal(text(reference), 'Psalm 19:1 (KJV)');
      assert.ok(contrast(reference.props.style.color, reference.props.style.background) >= 4.5);
      assert.equal(find(reading, 'data-word', 0)[0].props.style.opacity, 1);
      assert.equal(find(reading, 'data-word', 12)[0].props.style.opacity, 0, 'Later words wait for their cue');
      const complete = find(at('quotes/narrated-verse', 6.5, verse), 'data-word', any);
      assert.equal(complete.map(text).join(' '), verseText, 'The verse stays literal and complete');
      assert.ok(complete.every(word => word.props.style.opacity === 1));
      const paged = { ...verse, pages: ['One two three.', 'Four five six.'], wordSeconds: [0.5, 0.7, 0.9, 3, 3.2, 3.4] };
      assert.equal(find(at('quotes/narrated-verse', 1.5, paged), 'data-word', any).map(text).join(' '), 'One two three.');
      const secondPage = at('quotes/narrated-verse', 3.6, paged);
      assert.equal(find(secondPage, 'data-page', 1).length, 1);
      assert.equal(find(secondPage, 'data-word', any).map(text).join(' '), 'Four five six.');
      assert.equal(text(find(secondPage, 'data-reference', true)[0]), 'Psalm 19:1 (KJV)', 'The reference persists across pages');
      assert.throws(() => at('quotes/narrated-verse', 1, { ...paged, wordSeconds: [1] }), /one time per verse word \(6\)/);

      const lens = themed('Explainer');
      const unlit = at('explainer/lens-reveal', 0.1, lens);
      assert.equal(find(unlit, 'data-lens', true).length + find(unlit, 'data-inside', true).length, 0);
      const revealed = at('explainer/lens-reveal', 3.2, lens);
      const inside = find(revealed, 'data-inside', true)[0];
      assert.equal(inside.props.style.opacity, 1);
      const stage = (portrait ? 400 : 330) * scale;
      const [radius, lensX, lensY] = inside.props.style.clipPath.match(/[\d.]+/g).map(Number);
      for (const [actual, expected] of [[radius, stage * 0.3], [lensX, stage * 0.5], [lensY, stage * 0.5]]) assert.ok(Math.abs(actual - expected) < 1e-6, 'The lens settles on its target');
      assert.equal(find(revealed, 'data-check', true).length, 1);
      const lensLabel = find(revealed, 'data-label', true)[0];
      assert.equal(lensLabel.props.style.opacity, 1);
      assert.equal(text(lensLabel), 'How it works');
      const slotted = at('explainer/lens-reveal', 3.2, { ...lens, outside: 'OUTSIDE', inside: 'INSIDE', check: false });
      assert.ok(text(slotted).includes('OUTSIDE') && text(slotted).includes('INSIDE'));
      assert.equal(find(slotted, 'data-check', true).length, 0);

      const more = themed('Explainer');
      for (const rows of [[], Array(4).fill({ cause: 'A', effect: 'B' })]) {
        assert.throws(() => at('explainer/the-more-the-more', 0, { ...more, rows }), /one to three rows/);
      }
      assert.equal(find(at('explainer/the-more-the-more', 0.4, more), 'data-bar', 0)[0].props.style.width, '0%');
      assert.equal(find(at('explainer/the-more-the-more', 1, more), 'data-effect', 1)[0].props.style.opacity, 0, 'The second row waits for its cue');
      const grown = at('explainer/the-more-the-more', 6.5, more);
      for (const index of [0, 1]) {
        assert.equal(find(grown, 'data-bar', index)[0].props.style.width, '100%');
        assert.ok(Math.abs(Number(find(grown, 'data-effect', index)[0].props.style.scale) - 1.25) < 1e-9);
      }
      assert.equal(text(find(grown, 'data-header', 'cause')[0]), 'The more we understand');
      const effect = find(grown, 'data-effect', 0)[0].props.style;
      assert.ok(contrast(effect.color, effect.background) >= 4.5);

      const equation = themed('Explainer');
      assert.equal(find(at('explainer/concept-equation', 0.1, equation), 'data-card', 'left')[0].props.style.opacity, 0);
      const equated = at('explainer/concept-equation', 3, equation);
      for (const name of ['left', 'right']) assert.equal(find(equated, 'data-card', name)[0].props.style.opacity, 1);
      const symbol = find(equated, 'data-operator', 'operator')[0];
      assert.equal(symbol.props['aria-label'], 'is not');
      assert.equal(symbol.props.children.length, 3);
      assert.ok(symbol.props.children.every(line => line.props.strokeDashoffset === 0), 'The symbol is fully drawn');
      assert.equal(find(equated, 'data-card', 'result').length, 0);
      const emphasis = find(equated, 'data-card', 'right')[0].props.style;
      assert.ok(contrast(emphasis.color, emphasis.background) >= 4.5);
      const summed = at('explainer/concept-equation', 4, { ...equation, operator: '+', result: 'The whole picture' });
      assert.equal(find(summed, 'data-operator', 'operator')[0].props['aria-label'], 'plus');
      assert.equal(find(summed, 'data-operator', 'equals')[0].props['aria-label'], 'equals');
      assert.equal(text(find(summed, 'data-card', 'result')[0]), 'The whole picture');

      const spread = themed('Explainer');
      const alone = at('explainer/idea-spread', 0.8, spread);
      assert.equal(find(alone, 'data-copy', any).length, 0);
      assert.ok(Number(find(alone, 'data-idea', true)[0].props.style.scale) >= 0.9);
      const everywhere = at('explainer/idea-spread', 4, spread);
      const copies = find(everywhere, 'data-copy', any);
      assert.equal(copies.length, portrait ? 8 : 14);
      assert.ok(copies.every(copy => text(copy) === 'Science and faith are incompatible' && copy.props['aria-hidden'] === 'true'));
      assert.ok(Number(find(everywhere, 'data-idea', true)[0].props.style.scale) < 0.5, 'The idea shrinks into its cell');
      assert.equal(find(everywhere, 'data-label', true)[0].props.style.opacity, 1);

      const question = themed('Explainer');
      assert.throws(() => at('explainer/key-question', 0, { ...question, keyPhrase: 'missing words' }), /is not in the question/);
      assert.equal(find(at('explainer/key-question', 0.1, question), 'data-word', 0)[0].props.style.opacity, 0);
      const asked = at('explainer/key-question', 3, question);
      const questionWords = find(asked, 'data-word', any);
      assert.equal(questionWords.map(text).join(' '), 'Is science really the only way to know the truth?');
      assert.ok(questionWords.every(word => word.props.style.opacity === 1));
      const key = find(asked, 'data-key', true)[0];
      assert.equal(text(key), 'the only way');
      assert.ok(contrast(key.props.style.color, key.props.style.background) >= 4.5);

      const partial = themed('Explainer');
      for (const fraction of [0, 1.5]) assert.throws(() => at('explainer/partial-reveal', 0, { ...partial, fraction }), /fraction/);
      assert.equal(find(at('explainer/partial-reveal', 0.5, partial), 'data-reveal', any).length, 0);
      const part = at('explainer/partial-reveal', 3, partial);
      assert.equal(find(part, 'data-reveal', any)[0].props['data-reveal'], 151.2, 'The reveal stops at the requested fraction');
      assert.equal(text(find(part, 'data-label', true)[0]), 'Partially');
      assert.equal(find(at('explainer/partial-reveal', 3, { ...partial, fraction: 1 }), 'data-reveal', any)[0].props['data-reveal'], 360);

      const sky = themed('Background');
      const calm = at('background/starry-sky', 1, sky);
      assert.equal(calm.props.style.background, resolveTemplateTheme(sky.theme).inverseBackground);
      assert.equal(find(calm, 'data-star', any).length, 110);
      assert.equal(find(calm, 'data-warp', true).length, 0);
      assert.equal(find(at('background/starry-sky', 1, { ...sky, stars: 12 }), 'data-star', any).length, 12);
      const dive = { ...sky, diveSeconds: 1, diveDurationSeconds: 2 };
      const diving = at('background/starry-sky', 2, dive);
      assert.equal(find(diving, 'data-warp', true).length, 1);
      assert.ok(find(diving, 'data-star', any).every(star => star.props.style.opacity === 0), 'Twinkling stars give way to the warp');
      assert.equal(find(at('background/starry-sky', 3.5, dive), 'data-warp', true).length, 0);
      assert.throws(() => at('background/starry-sky', 0, { ...dive, diveDurationSeconds: 0.5 }), /at least 1 second/);
      assert.ok(text(at('background/starry-sky', 1, { ...sky, children: 'Over the sky' })).includes('Over the sky'));
    }
  }
});