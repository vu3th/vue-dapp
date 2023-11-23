<p align="center">
   <a href="https://vue-dapp-docs.netlify.app/">
    <img src="https://github.com/vu3th/vue-dapp/blob/main/demo/src/assets/logo.png" alt="VueDapp Brand" style="max-width:100%;" width="400">
  </a>
</p>
<h2 align="center">
  Vue Dapp
</h2>
<p align="center">
  Vue 3 library for building Dapps on Ethereum.
</p>

<p align="center">
  <!-- license -->
  <a href="https://github.com/vu3th/vue-dapp">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"/>
  </a>
  <!-- version -->
  <a href="https://www.npmjs.com/package/vue-dapp">
    <img src="https://badgen.net/npm/v/vue-dapp" alt="Version">
  </a>
  <!-- size -->
  <a href="https://bundlephobia.com/package/vue-dapp">
      <img src="https://img.shields.io/bundlephobia/minzip/vue-dapp" alt="Size">
  </a>

</p>

## Documentation

- v1: Work in progress, see [Discussion#141](https://github.com/vu3th/vue-dapp/discussions/141)


Brief versions and functionalities are as follows:

- v0.12.x: Add bitget wallet
- v0.11.x: Uses ethers v5 with WalletConnect dependencies update.
- v0.10.x: Uses ethers v6 and supports WalletConnect v2.
- v0.9.x: Uses ethers v5 and supports WalletConnect v2.
- Before v0.8.x: Uses ethers v5 and does not support WalletConnect v2.

I recommend keeping an eye on [vue3-dapp-starter](https://github.com/vu3th/vue3-dapp-starter) and [nuxt-dapp](https://github.com/vu3th/nuxt-dapp), as it strives to maintain a development-friendly version whenever possible.

Please be cautious when using the documentation below, as it has not been updated for some time.

- [Documentation (v0.9.x)](https://vue-dapp-docs.netlify.app/)
- [Migrating to v0.5.x ~ v0.9.x](https://vue-dapp-docs.netlify.app/migration)

## Packages

| Package                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| @vue-dapp/core          | useWalletStore, connector, utils, and metamask... |
| @vue-dapp/vd-board      | Vue components for connecting wallet              |
| @vue-dapp/walletconnect | WalletConnect integration                         |
| @vue-dapp/legacy        | vue-dapp version below v1                         |
| @vue-dapp/docs          | documentation                                     |
| @vue-dapp/app           | Nuxt 3 demo for v1                                |
| @vue-dapp/demo          | Vue 3 demo for @vue-dapp/legacy                   |


## Installation (below v0.10.x)

```bash
yarn add ethers vue-dapp
```

If you want to support more wallet providers not only MetaMask, you should install respective packages to enable the dynamic import.

- Support WalletConnect
```bash
yarn add @walletconnect/web3-provider
```

- Support Coinbase Wallet
```bash
yarn add @coinbase/wallet-sdk
```

- Support Gnosis Safe
```bash
yarn add @gnosis.pm/safe-apps-provider @gnosis.pm/safe-apps-sdk
```

## Quick Start

Step 1. Add plugin to your app:

```javascript
import { VueDapp } from "vue-dapp";
const app = createApp(App);
app.use(VueDapp);
app.mount("#app");
```

Step 2. By default, VueDapp includes `Mainnet` and `Goerli` networks, but you can extend it to include other networks:

```javascript
app.use(VueDapp, {
 autoConnect: true, // Automatically connect MetaMask wallet when the page is loaded
  networks: {
    80001: {
      chainId: ethers.utils.hexValue(80001),
      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      chainName: 'Mumbai',
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      nativeCurrency: {
        name: 'Mumbai',
        decimals: 18,
        symbol: 'MATIC',
      },
    },
    42161: {
      ...
    },
  },
});

```
For more examples please check:
https://github.com/wagmi-dev/wagmi/blob/main/packages/core/src/constants/chains.ts


Step 3. Add `<vd-board />` to your `App.vue` and add a button to open the board:

```vue
<button @click="open">Connect Wallet</button>
<vd-board :connectors="connectors" dark />
```

Step 4. Construct your connectors and use composable functions in your scripts:

```js
import {
  MetaMaskConnector,
  WalletConnectConnector,
  CoinbaseWalletConnector,
  useBoard,
} from "vue-dapp";

setup() {
  const { open } = useBoard();
  const infuraId = "";
  const connectors = [
    new MetaMaskConnector({
      appUrl: "http://localhost:3000",
    }),
    new WalletConnectConnector({
      qrcode: true,
      rpc: {
        1: `https://mainnet.infura.io/v3/${infuraId}`,
        4: `https://rinkeby.infura.io/v3/${infuraId}`,
      },
    }),
    new CoinbaseWalletConnector({
      appName: "Vue Dapp",
      jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
    }),
  ];
  return {
    connectors,
    open,
  };
}
```

Take a look at [Configurations](https://vue-dapp-docs.netlify.app/configurations) for more informations about Vue CLI, Vite, and Nuxt3 configurations.

To see the demo code, check it out [here](https://github.com/vu3th/vue-dapp/blob/main/demo/src/App.vue).

## Support 🙏

Gitcoin Grants 19: https://explorer.gitcoin.co/#/round/424/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008-75

## MIT license

Copyright (c) 2021-present, Johnson Chen ([@chnejohnson](https://twitter.com/chnejohnson))

