import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  root: 'demo/',
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: [
      {
        find: 'vue-dapp',
        replacement: resolve(__dirname, './src/index.ts'),
      },
    ],
  },
  // https://github.com/vitejs/vite/issues/2782#issuecomment-810226342
  define: {
    global: JSON.stringify({}),
  },
})
