import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  resolve: {
    alias: [
      {
        find: 'vue-dapp',
        replacement: resolve(__dirname, '../src/index.ts'),
      },
    ],
  },
})
