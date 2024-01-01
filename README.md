<p align="center">
   <a href="https://vue-dapp-docs.vercel.app/">
    <img src="https://github.com/vu3th/vue-dapp/blob/main/demo/src/assets/logo.png" alt="VueDapp Brand" style="max-width:100%;" width="400">
  </a>
</p>
<h2 align="center">
  Vue Dapp
</h2>
<p align="center">
  Vue library for building Dapps
</p>

<p align="center">
  <!-- license -->
  <a href="https://github.com/vu3th/vue-dapp">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"/>
  </a>
</p>

Notice that Vue Dapp v1 is working in progress. I expect to release a stable version by June 30, 2024.

I recommend keeping an eye on [vue3-dapp-starter](https://github.com/vu3th/vue3-dapp-starter) and [nuxt-dapp](https://github.com/vu3th/nuxt-dapp), as it strives to maintain a development-friendly version whenever possible.

 
## Monorepo Architecture

library


| Name                    | Description                                       | Version                                                                                                                                        | Size                                                                                                                                                             |
| ----------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @vue-dapp/core          | useWalletStore, connector, utils, and metamask... | <a href="https://www.npmjs.com/package/@vue-dapp/core"><img src="https://badgen.net/npm/v/@vue-dapp/core" alt="Version"></a>                   | <a href="https://bundlephobia.com/package/@vue-dapp/core"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/core" alt="Size"></a>                   |
| @vue-dapp/vd-board      | Vue components for connecting wallet              | <a href="https://www.npmjs.com/package/@vue-dapp/vd-board"><img src="https://badgen.net/npm/v/@vue-dapp/vd-board" alt="Version"></a>           | <a href="https://bundlephobia.com/package/@vue-dapp/vd-board"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/vd-board" alt="Size"></a>           |
| @vue-dapp/walletconnect | WalletConnect integration                         | <a href="https://www.npmjs.com/package/@vue-dapp/walletconnect"><img src="https://badgen.net/npm/v/@vue-dapp/walletconnect" alt="Version"></a> | <a href="https://bundlephobia.com/package/@vue-dapp/walletconnect"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/walletconnect" alt="Size"></a> |



app

| Name           | Description        |
| -------------- | ------------------ |
| @vue-dapp/app  | Nuxt 3 demo for v1 |
| @vue-dapp/docs | documentation      |

legacy

| Name             | Description                   |
| ---------------- | ----------------------------- |
| @vue-dapp/legacy | vue-dapp version below v1     |
| @vue-dapp/demo   | Vue demo for @vue-dapp/legacy |


## Installation

```bash
yarn add @vue-dapp/core @vue-dapp/vd-board
```

If you want to support more wallet providers not only MetaMask, you should install respective packages.

### WalletConnect
```bash
yarn add @vue-dapp/walletconnect
```

## Support 🙏

Gitcoin Grants 19: https://explorer.gitcoin.co/#/round/424/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008-75

## MIT license

Copyright (c) 2021-present, Johnson Chen ([@chnejohnson](https://twitter.com/chnejohnson))
