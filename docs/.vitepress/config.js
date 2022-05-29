module.exports = {
  title: 'Vue Dapp',
  description: 'Vue 3 library for building Dapps on Ethereum',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/png' }],
    ['meta', { name: 'author', content: 'Johnson Chen' }],
    ['meta', { property: 'og:title', content: 'vue-dapp' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue 3 library for building Dapps on Ethereum',
      },
    ],
  ],

  themeConfig: {
    repo: 'chnejohnson/vue-dapp',
    nav: [
      {
        text: 'Releases',
        link: 'https://github.com/chnejohnson/vue-dapp/releases',
      },
      {
        text: 'Demo',
        link: 'https://vue-dapp.netlify.app/',
      },
    ],
    sidebar: [
      {
        text: 'Introduction',
        children: [
          {
            text: 'Getting Started',
            link: '/',
          },
          {
            text: 'Migrating to v0.5.x',
            link: '/migration',
          },
          {
            text: 'Configurations',
            link: '/configurations',
          },
          {
            text: 'Contributing',
            link: '/contributing',
          },
          {
            text: 'Resources',
            link: '/resources',
          },
        ],
      },
      {
        text: 'API',
        children: [
          {
            text: 'Components',
            link: '/api/components',
          },
          {
            text: 'Connectors',
            link: '/api/connectors',
          },
          {
            text: 'Constants',
            link: '/api/constants',
          },
          {
            text: 'Directives',
            link: '/api/directives',
          },
          {
            text: 'useWallet',
            link: '/api/use-wallet',
          },
          {
            text: 'useEthers',
            link: '/api/use-ethers',
          },
          {
            text: 'useEthersHooks',
            link: '/api/use-ethers-hooks',
          },
          {
            text: 'useMulticall',
            link: '/api/use-multicall',
          },
          {
            text: 'Utilities',
            link: '/api/utilities',
          },
        ],
      },
    ],
  },
}
