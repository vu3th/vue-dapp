import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import VitePluginStyleInject from 'vite-plugin-style-inject'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
		vue(),
		VitePluginStyleInject(),
		dts({
			insertTypesEntry: true,
		}),
	],
	build: {
		assetsDir: 'assets',
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: '@vue-dapp/vd-board',
			fileName: 'vd-board',
		},
		outDir: 'dist',
		rollupOptions: {
			external: ['vue', 'pinia', '@vue-dapp/core'],
			output: {
				dir: 'dist',
				globals: {
					vue: 'Vue',
					pinia: 'Pinia',
				},
			},
		},
	},
})
