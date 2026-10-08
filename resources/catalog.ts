import { lexer, type Tokens } from 'marked';
import type { ComponentType } from 'react';
import catalog from '../.agents/skills/react-templates/catalog.md?raw';

export type Template = {
  id: string;
  name: string;
  category: string;
  description: string;
  provider: string;
  source: string;
  style: string;
  tags: string[];
  code: string;
  component: ComponentType<Record<string, unknown>>;
};

const components = import.meta.glob('../.agents/skills/react-templates/*/*.tsx', {
  eager: true,
}) as Record<string, Record<string, Template['component']>>;
const sourceFiles = import.meta.glob('../.agents/skills/react-templates/*/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function readCatalog(): Template[] {
  const entries: Template[] = [];
  let category = '';
  let current: Template | undefined;

  for (const token of lexer(catalog)) {
    if (token.type === 'heading' && token.depth === 2) {
      category = token.text.split(' (')[0];
      current = undefined;
    } else if (token.type === 'heading' && token.depth === 3) {
      const link = token.tokens?.find((inline) => inline.type === 'link') as Tokens.Link | undefined;
      if (!link) continue;
      const modulePath = `../.agents/skills/react-templates/${link.href.replace(/^\.\//, '')}`;
      const component = Object.values(components[modulePath] ?? {})[0];
      if (!component || !sourceFiles[modulePath]) {
        throw new Error(`Template source not found: ${link.href}`);
      }
      current = {
        id: link.href,
        name: link.text,
        category,
        description: '',
        provider: '',
        source: '',
        style: '',
        tags: [],
        code: sourceFiles[modulePath],
        component,
      };
      entries.push(current);
    } else if (current && token.type === 'blockquote') {
      current.description = token.text.trim();
    } else if (current && token.type === 'list') {
      for (const item of token.items) {
        const separator = item.text.indexOf(':');
        const key = item.text.slice(0, separator);
        const value = item.text.slice(separator + 1).trim();
        if (key === 'Provider') current.provider = value;
        if (key === 'Source') current.source = value;
        if (key === 'Selected style') current.style = value.replaceAll('`', '');
        if (key === 'Tags') {
          current.tags = lexer(value)[0]?.type === 'paragraph'
            ? (lexer(value)[0] as Tokens.Paragraph).tokens
                .filter((inline): inline is Tokens.Codespan => inline.type === 'codespan')
                .map((inline) => inline.text)
            : [];
        }
      }
    }
  }
  return entries;
}

export const templates = readCatalog();
export const categories = [...new Set(templates.map((template) => template.category))];