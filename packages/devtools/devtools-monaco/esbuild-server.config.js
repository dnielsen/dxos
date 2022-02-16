const { NodeGlobalsPolyfillPlugin, NodeModulesPlugin, FixMemdownPlugin } = require('@dxos/esbuild-plugins');

const workerEntryPoints = [
	'vs/language/json/json.worker.js',
	'vs/language/css/css.worker.js',
	'vs/language/html/html.worker.js',
	'vs/language/typescript/ts.worker.js',
	'vs/editor/editor.worker.js'
];

module.exports = {
  overrides: {
    sourcemap: true,
    loader: {
      '.jpg': 'file',
      '.png': 'file',
      '.svg': 'file',
      '.ttf': 'file',
    },
  },
  entryPoints: [
    'src/index.tsx',
    ...workerEntryPoints.map((entry) => `./node_modules/monaco-editor/esm/${entry}`)
  ],
  plugins: [
    NodeGlobalsPolyfillPlugin(), // broken rn in web-workers
    NodeModulesPlugin(), 
    FixMemdownPlugin(),
    {
      name: 'fix-react-monaco-editor',
      setup ({ onResolve }) {
        onResolve({ filter: /^monaco-editor\/esm\/vs\/editor\/editor\.api$/ }, arg => {
          return {
            path: require.resolve('monaco-editor/esm/vs/editor/editor.main.js', { paths: [arg.resolveDir] }),
          };
        });
      }
    }
  ],
  outdir: 'out',
  staticDir: 'public'
};
