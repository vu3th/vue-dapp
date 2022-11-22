import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import WindiCSS from 'vite-plugin-windicss'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import nodePolyfills from 'rollup-plugin-polyfill-node'

export default defineConfig({
  root: 'demo/',
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: {
      'vue-dapp': path.resolve(__dirname, './src/index.ts'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Enable esbuild polyfill plugins, refer to https://stackoverflow.com/a/72440811/10752354
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // @walletconnect/web3-provider is CommonJS, so need to open this
    },
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin used during production bundling, refer to https://stackoverflow.com/a/72440811/10752354
        nodePolyfills(),
      ],
    },
  },
})
