import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import inject from '@rollup/plugin-inject'

export default defineConfig({
  root: 'demo/',
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: {
      'vue-dapp': resolve(__dirname, './src/index.ts'),
    },
  },
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
