import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		assetsDir: 'assets',
		lib: {
			entry: path.resolve(__dirname, 'src/index.lib.ts'),
			name: 'vd-board',
		},
		outDir: 'dist',
		rollupOptions: {
			external: ['vue', 'pinia'],
			output: {
				dir: 'dist',
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
})
