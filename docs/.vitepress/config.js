module.exports = {
  title: 'Vue Dapp',
  description: 'Vue 3 library for building Dapps with ethers.js.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/png' }],
    ['meta', { name: 'author', content: 'Johnson Chen' }],
    ['meta', { property: 'og:title', content: 'vue-dapp' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Vue 3 composable and components library for building Dapps with ethers.js.',
      },
    ],
  ],

  themeConfig: {
    repo: 'chnejohnson/vue-dapp',
    nav: [
      {
        text: 'Demo',
        link: 'https://vue-dapp-demo.netlify.app/',
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
        text: 'Guidelines',
        children: [
          {
            text: 'Composable Usage',
            link: '/guide/composable-usage',
          },
          {
            text: 'Component Usage',
            link: '/guide/component-usage',
          },
        ],
      },
      {
        text: 'API Reference',
        children: [
          {
            text: 'useWallet',
            link: '/api/use-wallet',
          },
          {
            text: 'useEthers',
            link: '/api/use-ethers',
          },
        ],
      },
    ],
  },
}
