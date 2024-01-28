module.exports = {
	title: 'Vue Dapp',
	description: 'Vue library for building Dapps',
	head: [
		['link', { rel: 'icon', href: '/favicon.ico', type: 'image/png' }],
		['meta', { name: 'author', content: 'Johnson Chen' }],
		['meta', { property: 'og:title', content: 'vue-dapp' }],
		[
			'meta',
			{
				property: 'og:description',
				content: 'Vue library for building Dapps',
			},
		],
	],

	themeConfig: {
		repo: 'chnejohnson/vue-dapp',
		nav: [
			{
				text: 'v1.0.0-alpha',
				link: 'https://github.com/vu3th/vue-dapp/releases',
			},
			{
				text: 'Demo',
				link: 'https://vue-dapp.vercel.app/',
			},
		],
		sidebar: [
			{
				text: 'Introduction',
				items: [
					{
						text: 'Getting Started',
						link: '/',
					},
					// {
					// 	text: 'Migrating to v1',
					// 	link: '/migration',
					// },
					{
						text: 'Examples',
						link: '/examples',
					},
					{
						text: 'Contributing',
						link: '/contributing',
					},
				],
			},
			{
				text: 'API',
				items: [
					{
						text: '@vue-dapp/modal',
						link: '/api/modal.md',
					},
				],
			},
		],
	},
}
