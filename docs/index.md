# Vue Dapp

Vue Dapp v1 is working in progress, see [Discussion#141](https://github.com/vu3th/vue-dapp/discussions/141). I would probably release a stable version by the end of 2023.

I recommend keeping an eye on [vue3-dapp-starter](https://github.com/vu3th/vue3-dapp-starter) and [nuxt-dapp](https://github.com/vu3th/nuxt-dapp), as it strives to maintain a development-friendly version whenever possible.


## Monorepo Architecture

library

| Name                    | Description                  |
| ----------------------- | ---------------------------- |
| @vue-dapp/core          | useVueDapp & VueDappProvider |
| @vue-dapp/modal         | VueDappModal                 |
| @vue-dapp/walletconnect | WalletConnect integration    |

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
yarn add @vue-dapp/core @vue-dapp/modal
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
