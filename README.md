<p align="center">
   <a href="https://vue-dapp-docs.netlify.app/">
    <img src="https://github.com/chnejohnson/vue-dapp/blob/main/demo/src/assets/logo.png" alt="VueDapp Brand" style="max-width:100%;" width="400">
  </a>
</p>
<h2 align="center">
  Vue Dapp
</h2>
<p align="center">
  Vue 3 library for building Dapps on Ethereum.
</p>

<p align="center">
  <a href="https://github.com/chnejohnson/vue-dapp">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="mit license"/>
  </a>
</p>

## Documentation

- [Documentation](https://vue-dapp-docs.netlify.app/)
- [Migrating to v0.5.x](https://vue-dapp-docs.netlify.app/migration)

## Installation

```bash
yarn add ethers vue-dapp
```

## Quick Start

Step 1. Add plugin to your app:

```javascript
import { VueDapp } from "vue-dapp";
const app = createApp(App);
app.use(VueDapp);
app.mount("#app");
```

Step 2. Add `<vd-board />` to your `App.vue` and add a button to open the board:

```vue
<button @click="open">Connect Wallet</button>
<vd-board :connectors="connectors" dark />
```

Step 3. Construct your connectors and use composable functions in your scripts:

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

To see the demo code, check it out [here](https://github.com/chnejohnson/vue-dapp/blob/main/demo/src/App.vue).

## Support 🙏

Gitcoin Grants: https://gitcoin.co/grants/3987/vue-dapp

## MIT license

Copyright (c) 2021-present, Johnson Chen ([@chnejohnson](https://twitter.com/chnejohnson))