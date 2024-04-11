import { nodePolyfills } from 'vite-plugin-node-polyfills'
import packageJSON from './package.json'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	// naive-ui: https://www.naiveui.com/en-US/os-theme/docs/ssr
	build: {
		transpile:
			process.env.NODE_ENV === 'production'
				? ['naive-ui', '@css-render/vue3-ssr', '@juggle/resize-observer']
				: ['@juggle/resize-observer'],
	},
	vite: {
		plugins: [
			nodePolyfills(), // only for @vue-dapp/coinbase
			Components({
				dts: true,
				resolvers: [NaiveUiResolver()], // Automatically register all components in the `components` directory
			}),
		],
		optimizeDeps: {
			include: process.env.NODE_ENV === 'development' ? ['naive-ui'] : [],
		},
	},
	components: [
		{
			path: '~/components',
			pathPrefix: false, // auto-import components based only on its name, not path
		},
	],
	modules: [
		'@vue-dapp/nuxt',
		'@nuxtjs/tailwindcss',
		[
			'@pinia/nuxt',
			{
				autoImports: ['defineStore', 'storeToRefs'],
			},
		],
		'@pinia-plugin-persistedstate/nuxt',
		'@vueuse/nuxt',
		'nuxt-icon',
	],
	imports: {
		dirs: ['store'],
	},
	tailwindcss: {
		cssPath: '~/styles/tailwind.css',
		configPath: 'tailwind.config',
		injectPosition: 'last', // https://tailwindcss.nuxtjs.org/getting-started/options#injectposition
	},
	css: ['~/styles/main.scss'],
	runtimeConfig: {
		public: {
			apiBase: '',
		},
	},
	app: {
		// opengraph https://www.opengraph.xyz/url/https%3A%2F%2Fvue-dapp.vercel.app%2F
		head: {
			title: 'Vue Dapp - Essential Web3 Tools for Vue Developers',
			meta: [
				{
					charset: 'utf-8',
				},
				{
					name: 'viewport',
					content:
						'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover',
					// Disable Auto Zoom in Input "Text" tag https://stackoverflow.com/a/13706151/19799243
				},
				{
					name: 'description',
					content: packageJSON.description,
				},
				{
					name: 'author',
					content: packageJSON.author,
				},
				{
					name: 'keywords',
					content:
						'web3,dapp,development,developer,library,blockchain,vue,vuejs,vue3,nuxt,nuxt3,wallet,crypto,typescript,javascript,ethereum,account,network,eip-6963',
				},
				// Facebook Meta Tags
				{
					property: 'og:type',
					content: 'website',
				},
				{
					property: 'og:title',
					content: 'Vue Dapp - Essential Web3 Tools for Vue Developers',
				},
				{
					property: 'og:description',
					content: packageJSON.description,
				},
				{
					property: 'og:url',
					content: 'https://vue-dapp.vercel.app/',
				},
				{
					property: 'og:image',
					content: 'https://vue-dapp.vercel.app/banner16x9.png',
				},

				// Twitter Meta Tags
				{
					name: 'twitter:card',
					content: 'summary_large_image',
				},
				{
					property: 'twitter:domain',
					content: 'vue-dapp.vercel.app',
				},
				{
					property: 'twitter:url',
					content: 'https://vue-dapp.vercel.app/',
				},
				{
					name: 'twitter:title',
					content: 'Vue Dapp - Essential Web3 Tools for Vue Developers',
				},
				{
					name: 'twitter:description',
					content: packageJSON.description,
				},
				{
					name: 'twitter:image',
					content: 'https://vue-dapp.vercel.app/banner16x9.png',
				},
			],
			link: [{ rel: 'icon', href: '/favicon.ico' }],
		},
	},
})
