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
            text: 'Using Vite',
            link: '/using-vite',
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
        text: 'API Reference',
        children: [
          {
            text: 'Components',
            link: '/api/components',
          },
          {
            text: 'Directives',
            link: '/api/directives',
          },
          {
            text: 'Utilities',
            link: '/api/utilities',
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
        ],
      },
    ],
  },
}
