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
			name: 'vd-core',
		},
		outDir: 'dist',
		rollupOptions: {
			external: ['vue', 'pinia'],
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
