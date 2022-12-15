import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import WindiCSS from 'vite-plugin-windicss'
import nodeStdlibBrowser from 'node-stdlib-browser'
import inject from '@rollup/plugin-inject'

export default defineConfig({
  root: 'demo/',
  plugins: [
    vue(),
    WindiCSS(),
    // https://github.com/niksy/node-stdlib-browser#vite
    {
      ...inject({
        global: [
          require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
          'global',
        ],
        process: [
          require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
          'process',
        ],
        Buffer: [
          require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
          'Buffer',
        ],
      }),
      enforce: 'post',
    },
  ],
  resolve: {
    // Enable polyfill node used in development to prevent from vite's browser compatibility warning
    alias: {
      'vue-dapp': path.resolve(__dirname, './src/index.ts'),
      ...nodeStdlibBrowser,
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'], // pre-bundle buffer and process
    // Enable polyfill node used in development, refer to https://github.com/sodatea/vite-plugin-node-stdlib-browser/blob/b17f417597c313ecd52c3e420ba8fc33bcbdae20/index.cjs#L17
    esbuildOptions: {
      target: 'esnext', // Enable Big integer literals
    },
  },
  build: {
    target: 'esnext', // Enable Big integer literals
    commonjsOptions: {
      transformMixedEsModules: true, // Enable @walletconnect/web3-provider which has some code in CommonJS
    },
  },
})
