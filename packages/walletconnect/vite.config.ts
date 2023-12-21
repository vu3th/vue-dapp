import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

const name = pkg.name.split('/').pop()

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
			name: pkg.name,
			fileName: name,
		},
		outDir: 'dist',
	},
})
