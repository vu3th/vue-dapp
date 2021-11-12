import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  root: 'demo/',
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: {
      'vue-dapp': resolve(__dirname, './src/index.ts'),
      process: require.resolve('process'),
      buffer: require.resolve('buffer'),
      util: require.resolve('util'),
    },
  },
})
