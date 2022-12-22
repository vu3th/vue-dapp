import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import nodeStdlibBrowser from 'node-stdlib-browser'
import inject from '@rollup/plugin-inject'

export default defineConfig({
  root: 'demo/',
  plugins: [vue()],
  resolve: {
    alias: {
      'vue-dapp': path.resolve(__dirname, './src/index.ts'),
      ...nodeStdlibBrowser, // Add browser polyfills of Node.js built-in libraries for Vite projects
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
      target: 'esnext', // Enable Big integer literals
    },
  },
  build: {
    target: 'esnext', // Enable Big integer literals
    commonjsOptions: {
      transformMixedEsModules: true, // Enable @walletconnect/web3-provider which has some code in CommonJS
    },
    rollupOptions: {
      plugins: [
        // @ts-ignore
        inject({
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
      ],
    },
  },
})
