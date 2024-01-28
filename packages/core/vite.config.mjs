import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
		vue(),
		dts({
			insertTypesEntry: true,
		}),
	],
	build: {
		assetsDir: 'assets',
		// Vite Library Mode https://vitejs.dev/guide/build.html#library-mode
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: '@vue-dapp/core',
			fileName: 'core',
		},
		outDir: 'dist',
		rollupOptions: {
			external: ['vue', 'pinia'],
			output: {
				dir: 'dist',
				globals: {
					vue: 'vue',
					pinia: 'pinia',
				},
			},
		},
	},
})
