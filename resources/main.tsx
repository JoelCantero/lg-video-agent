import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Player, type PlayerRef } from '@remotion/player';
import {
  ArrowUpRight, Camera, Check, Clapperboard, Code2, Copy, Disc3, Download, Expand, FolderOpen,
  GitFork, LayoutGrid, ListVideo, Moon, Music, Play, Quote, Search, Sun, Type, Volume2, X,
} from 'lucide-react';
import { categories, templates, type Template } from './catalog';
import { soundEffects } from './sound-effects';
import { backgroundMusic } from './background-music';
import { templatePreviewTheme, type TemplatePreset } from '../.agents/skills/react-templates/theme';
import urbanistLicense from '../node_modules/@fontsource/urbanist/LICENSE?raw';
import openSansLicense from '../node_modules/@fontsource/open-sans/LICENSE?raw';
import './styles.css';

function previewDuration(template: Template) {
  if (template.category === 'Logo') return 90;
  if (template.name === 'Complementary Panels') return 180;
  if (template.name === 'Scripture Reference') return 240;
  if (template.name === 'Negation to Affirmation') return 240;
  // The cut falls at the middle (frame 91), so the frame-90 poster shows the bands mid-sweep.
  if (template.name === 'Scene Sweep') return 182;
  if (template.name === 'Word Captions') return 240;
  if (template.name === 'Narrated Verse' || template.name === 'The More, The More') return 210;
  if (['Lens Reveal', 'Idea Spread', 'Key Question', 'Partial Reveal'].includes(template.name)) return 180;
  return 150;
}

function PresetSelector({ preset, onChange }: { preset: TemplatePreset; onChange: (preset: TemplatePreset) => void }) {
  return <div className="preset-selector" role="group" aria-label="Estil dels templates">
    <button aria-pressed={preset === 'original'} onClick={() => onChange('original')}>Original</button>
    <button aria-pressed={preset === 'elg'} onClick={() => onChange('elg')}>ELG</button>
  </div>;
}

function PreviewControls({ preset, onPresetChange, dark, onDarkChange }: {
  preset: TemplatePreset;
  onPresetChange: (preset: TemplatePreset) => void;
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
}) {
  return <div className="preview-controls">
    <PresetSelector preset={preset} onChange={onPresetChange} />
    <button className="preview-switch" role="switch" aria-checked={dark} aria-label="Fons fosc de les previsualitzacions" title="Canvia el fons de les previsualitzacions" onClick={() => onDarkChange(!dark)}>
      {dark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
      <span className="preview-switch-label">{dark ? 'Fosc' : 'Clar'}</span>
      <span className="preview-switch-track" aria-hidden="true"><span /></span>
    </button>
  </div>;
}

function TemplateCard({ template, preset, previewDark, enabled, onExpand }: {
  template: Template;
  preset: TemplatePreset;
  previewDark: boolean;
  enabled: boolean;
  onExpand: (view?: 'preview' | 'code') => void;
}) {
  const player = useRef<PlayerRef>(null);
  const [hovered, setHovered] = useState(false);
  const playing = enabled && hovered;

  useEffect(() => {
    if (playing) {
      player.current?.seekTo(0);
      player.current?.play();
    }
    else player.current?.pause();
  }, [playing, preset, previewDark]);

  return (
    <article className="template-card" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="preview">
        <Player
          key={`${preset}-${previewDark}`}
          ref={player}
          component={template.component}
          inputProps={{ theme: templatePreviewTheme(preset, previewDark, template.category), ...(template.category === 'Logo' ? { logo: preset } : {}), ...(template.name === 'Gradient Text' ? { text: 'Captivating' } : {}) }}
          durationInFrames={previewDuration(template)}
          compositionWidth={960}
          compositionHeight={540}
          fps={30}
          autoPlay={false}
          initialFrame={template.category === 'Logo' ? 89 : 90}
          loop
          initiallyMuted
          clickToPlay={false}
          style={{ width: '100%', height: '100%' }}
        />
        <span className="preview-category">{template.category}</span>
        <div className="preview-actions">
          <button className="icon-button preview-button" title="Amplia" aria-label={`Amplia ${template.name}`} onClick={() => onExpand()}><Expand size={16} /></button>
        </div>
      </div>
      <div className="card-body">
        <div className="card-title"><h3>{template.name}</h3><span>{template.style}</span></div>
        <p className="description">{template.description}</p>
        <div className="tags">{template.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="card-footer">
          <span>{template.provider}</span>
          <button className="text-button" onClick={() => onExpand('code')}><Code2 size={15} /> Codi</button>
          {template.source.startsWith('https://') && <a className="icon-button" href={template.source} target="_blank" rel="noreferrer" title="Font original" aria-label={`Font original de ${template.name}`}><ArrowUpRight size={17} /></a>}
        </div>
      </div>
    </article>
  );
}

function TemplateDialog({ template, preset, onPresetChange, previewDark, onPreviewDarkChange, initialView, onClose }: { template: Template; preset: TemplatePreset; onPresetChange: (preset: TemplatePreset) => void; previewDark: boolean; onPreviewDarkChange: (dark: boolean) => void; initialView: 'preview' | 'code'; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<PlayerRef>(null);
  const [view, setView] = useState(initialView);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => { dialog.current?.showModal(); }, []);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(template.code);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <dialog ref={dialog} className="template-dialog" onClose={onClose} onCancel={(event) => { event.preventDefault(); onClose(); }} onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="dialog-header"><div><span className="eyebrow">{template.category}</span><h2>{template.name}</h2></div><button className="icon-button" title="Tanca" aria-label="Tanca" onClick={onClose}><X size={20} /></button></div>
      <div className="dialog-tabs" role="tablist" aria-label="Vista del template">
        <button role="tab" aria-selected={view === 'preview'} aria-controls="template-detail" onClick={() => setView('preview')}><Play size={16} /> Animacio</button>
        <button role="tab" aria-selected={view === 'code'} aria-controls="template-detail" onClick={() => setView('code')}><Code2 size={16} /> Codi</button>
        <PreviewControls preset={preset} onPresetChange={onPresetChange} dark={previewDark} onDarkChange={onPreviewDarkChange} />
      </div>
      <div id="template-detail" role="tabpanel">
        {view === 'preview' ? <div className="dialog-preview" onMouseEnter={() => { player.current?.seekTo(0); player.current?.play(); }} onMouseLeave={() => player.current?.pause()}><Player key={`${preset}-${previewDark}`} ref={player} component={template.component} inputProps={{ theme: templatePreviewTheme(preset, previewDark, template.category), ...(template.category === 'Logo' ? { logo: preset } : {}), ...(template.name === 'Gradient Text' ? { text: 'Captivating' } : {}) }} durationInFrames={previewDuration(template)} compositionWidth={960} compositionHeight={540} fps={30} initialFrame={template.category === 'Logo' ? 89 : 90} autoPlay={false} loop initiallyMuted controls style={{ width: '100%' }} /></div> : <div className="code-view"><div className="code-toolbar"><span>{template.id.split('/').pop()}</span><button className="text-button" onClick={copyCode}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copiat' : 'Copia'}</button></div>{copyError && <p role="alert">No s'ha pogut copiar el codi.</p>}<pre><code>{template.code}</code></pre></div>}
      </div>
      <div className="dialog-footer"><p>{template.description}</p>{template.source.startsWith('https://') ? <a className="text-button" href={template.source} target="_blank" rel="noreferrer">{template.provider} <ArrowUpRight size={16} /></a> : <span>{template.provider}</span>}</div>
    </dialog>
  );
}

const audioLibraries = {
  sounds: { title: 'Sound Effects', items: soundEffects, category: 'Camera', Icon: Camera, units: ['efecte', 'efectes'], placeholder: 'Cerca sons o tags', empty: 'Cap efecte trobat' },
  music: { title: 'Background Music', items: backgroundMusic, category: 'Lo-fi', Icon: Disc3, units: ['pista', 'pistes'], placeholder: 'Cerca música o tags', empty: 'Cap pista trobada' },
};

function AudioLibrary({ section }: { section: keyof typeof audioLibraries }) {
  const { title, items, category, Icon, units, placeholder, empty } = audioLibraries[section];
  const [query, setQuery] = useState('');
  const [failed, setFailed] = useState<string[]>([]);
  const activeAudio = useRef<HTMLAudioElement | null>(null);
  const search = query.trim().toLowerCase();
  const visible = items.filter((sound) => [sound.name, sound.description, sound.creator, ...sound.tags].join(' ').toLowerCase().includes(search));

  useEffect(() => () => { activeAudio.current?.pause(); }, []);

  return <main id={`${section}-panel`} role="tabpanel" aria-labelledby={`${section}-tab`} className="workspace">
    <aside className="sidebar">
      <h2>Categories</h2>
      <div className="category-list"><button className="active" aria-pressed="true"><Icon size={17} /><span>{category}</span><span className="count">{items.length}</span></button></div>
      <div className="sidebar-meta"><Volume2 size={16} /><span>MP3</span></div>
    </aside>
    <section className="library" aria-label={title}>
      <div className="library-heading"><div><span className="eyebrow">Biblioteca</span><h1>{title}</h1></div><span className="library-count">{visible.length} {units[visible.length === 1 ? 0 : 1]}</span></div>
      <div className="toolbar"><label className="search-field"><Search size={18} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} aria-label={placeholder} />{query && <button className="icon-button" title="Neteja la cerca" aria-label="Neteja la cerca" onClick={() => setQuery('')}><X size={16} /></button>}</label></div>
      <div className="template-grid">{visible.map((sound) => <article className="template-card sound-card" key={sound.id}>
        <div className="card-body">
          <div className="sound-heading"><Icon size={20} aria-hidden="true" /><h3>{sound.name}</h3></div>
          <p className="description">{sound.description}</p>
          <audio controls preload="metadata" src={sound.src} aria-label={`Escolta ${sound.name}`} onPlay={(event) => {
            if (activeAudio.current && activeAudio.current !== event.currentTarget) activeAudio.current.pause();
            activeAudio.current = event.currentTarget;
          }} onError={() => setFailed((previous) => previous.includes(sound.id) ? previous : [...previous, sound.id])} />
          {failed.includes(sound.id) && <p className="audio-error" role="alert">No s'ha pogut carregar aquest àudio.</p>}
          <div className="tags">{sound.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="card-footer"><span title={`ID original: ${sound.sourceId}`}>{sound.creator}</span><a className="icon-button" href={sound.src} download={`${sound.id}.mp3`} title="Descarrega MP3" aria-label={`Descarrega ${sound.name}`}><Download size={17} /></a></div>
        </div>
      </article>)}</div>
      {visible.length === 0 && <div className="empty-state"><Search size={28} /><h2>{empty}</h2><p>{query}</p><button className="text-button" onClick={() => setQuery('')}>Neteja la cerca</button></div>}
    </section>
  </main>;
}

function App() {
  const [section, setSection] = useState<'templates' | keyof typeof audioLibraries>('templates');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Template | null>(null);
  const [detailView, setDetailView] = useState<'preview' | 'code'>('preview');
  const [preset, setPreset] = useState<TemplatePreset>('elg');
  const [previewDark, setPreviewDark] = useState(false);
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark');
  const search = query.trim().toLowerCase();
  const visible = templates.filter((template) =>
    (category === 'all' || template.category === category) &&
    [template.name, template.description, template.category, ...template.tags].join(' ').toLowerCase().includes(search),
  );
  const visibleCategories = categories.filter((name) => visible.some((template) => template.category === name));

  function toggleTheme() {
    document.documentElement.dataset.theme = dark ? 'light' : 'dark';
    setDark(!dark);
  }

  return (
    <>
      <header className="app-header">
        <a className="brand" href="./"><span className="brand-mark"><Clapperboard size={23} /></span><span>Video Agent <strong>Resources</strong></span></a>
        <div className="header-actions"><span className="local-status"><span /> Localhost</span><button className="icon-button" title={dark ? 'Tema clar' : 'Tema fosc'} aria-label={dark ? 'Tema clar' : 'Tema fosc'} onClick={toggleTheme}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button></div>
      </header>
      <nav className="app-tabs" aria-label="Recursos"><button id="templates-tab" aria-pressed={section === 'templates'} aria-controls="templates-panel" onClick={() => setSection('templates')}><LayoutGrid size={17} /> Templates <span>{templates.length}</span></button><button id="sounds-tab" aria-pressed={section === 'sounds'} aria-controls="sounds-panel" onClick={() => setSection('sounds')}><Volume2 size={17} /> Sound Effects <span>{soundEffects.length}</span></button><button id="music-tab" aria-pressed={section === 'music'} aria-controls="music-panel" onClick={() => setSection('music')}><Music size={17} /> Background Music <span>{backgroundMusic.length}</span></button></nav>
      {section !== 'templates' ? <AudioLibrary key={section} section={section} /> : <main id="templates-panel" role="tabpanel" aria-labelledby="templates-tab" className="workspace">
        <aside className="sidebar">
          <h2>Categories</h2>
          <div className="category-list">
            <button className={category === 'all' ? 'active' : ''} aria-pressed={category === 'all'} onClick={() => setCategory('all')}><LayoutGrid size={17} /><span>Totes</span><span className="count">{templates.length}</span></button>
            {categories.map((name) => { const Icon = name === 'Text' ? Type : name === 'Explainer' ? ListVideo : name === 'Quotes' ? Quote : name === 'Diagram' ? GitFork : FolderOpen; return <button key={name} className={category === name ? 'active' : ''} aria-pressed={category === name} onClick={() => setCategory(name)}><Icon size={17} /><span>{name}</span><span className="count">{templates.filter((template) => template.category === name).length}</span></button>; })}
          </div>
          <div className="sidebar-meta"><Clapperboard size={16} /><span>React + Remotion</span></div>
        </aside>
        <section className="library" aria-label="Templates">
          <div className="library-heading"><div><span className="eyebrow">Biblioteca</span><h1>Templates</h1></div><span className="library-count">{visible.length} templates</span></div>
          <div className="toolbar"><label className="search-field"><Search size={18} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca templates o tags" aria-label="Cerca templates o tags" />{query && <button className="icon-button" title="Neteja la cerca" aria-label="Neteja la cerca" onClick={() => setQuery('')}><X size={16} /></button>}</label><PreviewControls preset={preset} onPresetChange={setPreset} dark={previewDark} onDarkChange={setPreviewDark} /></div>
          {visibleCategories.map((name) => <section className="category-section" key={name}><div className="section-heading"><h2>{name}</h2><span>{visible.filter((template) => template.category === name).length}</span><div /></div><div className="template-grid">{visible.filter((template) => template.category === name).map((template) => <TemplateCard key={template.id} template={template} preset={preset} previewDark={previewDark} enabled={!selected} onExpand={(view = 'preview') => { setDetailView(view); setSelected(template); }} />)}</div></section>)}
          {visible.length === 0 && <div className="empty-state"><Search size={28} /><h2>Cap template trobat</h2><p>{query}</p><button className="text-button" onClick={() => { setQuery(''); setCategory('all'); }}>Neteja els filtres</button></div>}
        </section>
      </main>}
      <footer className="app-footer"><span>Video Agent Resources</span><span>{templates.length} templates / {soundEffects.length} sound effects / {backgroundMusic.length} background {backgroundMusic.length === 1 ? 'track' : 'tracks'}</span></footer>
      <details className="font-licenses"><summary>Llicències de les fonts</summary><h2>Urbanist</h2><pre>{urbanistLicense}</pre><h2>Open Sans</h2><pre>{openSansLicense}</pre></details>
      {selected && <TemplateDialog key={selected.id} template={selected} preset={preset} onPresetChange={setPreset} previewDark={previewDark} onPreviewDarkChange={setPreviewDark} initialView={detailView} onClose={() => setSelected(null)} />}
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);