// @ts-check

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'Vue Dapp',
  description:
    'Vue 3 composable and components library for building Dapps with ethers.js.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
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
    [
      'meta',
      {
        property: 'og:image',
        content: '',
      },
    ],
    ['meta', { name: 'twitter:creator', content: '@Johnson42558425' }],
    ['meta', { name: 'twitter:image', content: '' }],
  ],
  themeConfig: {
    repo: 'chnejohnson/vue-dapp',
    sidebar: [
      {
        text: 'Getting Started',
        children: [
          {
            text: 'Introduction',
            link: '/introduction',
          },
          {
            text: 'Installation',
            link: '/installation',
          },
          {
            text: 'Quick Start',
            link: '/quick-start',
          },
          {
            text: 'Reference',
            link: '/reference',
          },
          {
            text: 'Demo',
            link: '/demo',
          },
        ],
      },
      {
        text: 'Features',
        children: [
          {
            text: 'Composable Usage',
            link: '/composable-usage',
          },
          {
            text: 'Component Usage',
            link: '/component-usage',
          },
        ],
      },
      {
        text: 'API',
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
