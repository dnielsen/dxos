//
// Copyright 2020 DXOS.org
//

const {
  NodeGlobalsPolyfillPlugin,
  FixMemdownPlugin,
  FixGracefulFsPlugin,
  NodeModulesPlugin
} = require('@dxos/esbuild-plugins');
// const { nodeExternalsPlugin } = require('esbuild-node-externals');

let jsDomPlugin = {
  name: 'jsdom-plugin',
  setup(build) {
    // Intercept import paths called "env" so esbuild doesn't attempt
    // to map them to a file system location. Tag them with the "env-ns"
    // namespace to reserve them for this plugin.
    build.onResolve({ filter: /^jsdom$/ }, args => ({
      path: args.path,
      namespace: 'jsdom-tag',
    }))

    // Load paths tagged with the "jsdom-tag" namespace and behave as if
    // they point to a JSON file containing the environment variables.
    build.onLoad({ filter: /.*/, namespace: 'jsdom-tag' }, () => ({
      contents: 'throw new Error();'
    }))
  },
}

/** @type {import('@dxos/esbuild-server').Config} */
module.exports = {
  // platform: 'node',
  // format: 'cjs',
  // sourcemap: 'external',
  plugins: [
    NodeGlobalsPolyfillPlugin(),
    FixMemdownPlugin(),
    FixGracefulFsPlugin(),
    NodeModulesPlugin(),
    jsDomPlugin
    // nodeExternalsPlugin({
    //   allowList: [
    //     "@emotion/css",
    //     "@emotion/react",
    //     "@emotion/styled",
    //     "react",
    //     "react-dom"
    //   ]
    // })
  ],
  overrides: {
    sourcemap: 'inline',
    metafile: true,
  },
};
