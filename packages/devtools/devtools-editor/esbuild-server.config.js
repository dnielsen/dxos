//
// Copyright 2020 DXOS.org
//

const {
  NodeGlobalsPolyfillPlugin,
  FixMemdownPlugin,
  FixGracefulFsPlugin,
  NodeModulesPlugin
} = require('@dxos/esbuild-plugins');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

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
  },
};
