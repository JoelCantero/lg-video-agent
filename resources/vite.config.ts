import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { parse, serialize, type DefaultTreeAdapterMap } from 'parse5';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [{
    name: 'resources-inline-html',
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        if (!context.bundle) return html;
        const document = parse(html);
        const inlined = new Set<string>();

        function inlineAssets(node: DefaultTreeAdapterMap['node']) {
          if ('tagName' in node) {
            const script = node.tagName === 'script';
            const stylesheet = node.tagName === 'link' && node.attrs.some((attr) => attr.name === 'rel' && attr.value === 'stylesheet');
            const reference = node.attrs.find((attr) => attr.name === (script ? 'src' : 'href'));
            if ((script || stylesheet) && reference) {
              const assetPath = reference.value.replace(/^\.?\//, '');
              const asset = context.bundle?.[assetPath];
              if (asset) {
                const content = asset.type === 'chunk' ? asset.code : String(asset.source);
                node.tagName = script ? 'script' : 'style';
                node.nodeName = node.tagName;
                node.attrs = script ? [{ name: 'type', value: 'module' }] : [];
                node.childNodes = [{ nodeName: '#text', value: script ? content.replace(/<\/script/gi, '<\\/script') : content, parentNode: node }];
                inlined.add(assetPath);
              }
            }
          }
          if ('childNodes' in node) node.childNodes.forEach(inlineAssets);
        }

        inlineAssets(document);
        for (const assetPath of inlined) delete context.bundle[assetPath];
        return serialize(document);
      },
    },
  }],
  server: { port: 4173 },
  build: { outDir: 'dist', cssCodeSplit: false, assetsInlineLimit: Infinity, chunkSizeWarningLimit: 1000 },
});