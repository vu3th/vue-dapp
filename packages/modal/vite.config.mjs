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
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: '@vue-dapp/modal',
			fileName: 'modal',
		},
		outDir: 'dist',
		rollupOptions: {
			external: ['vue', '@vue-dapp/core'],
			output: {
				dir: 'dist',
				globals: {
					vue: 'vue',
					'@vue-dapp/core': 'core',
				},
			},
		},
	},
})
