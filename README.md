<p align="center">
  <a href="https://github.com/chnejohnson/vue-dapp/blob/main/demo/src/assets/logo.png">
    <img src="https://github.com/chnejohnson/vue-dapp/blob/main/demo/src/assets/logo.png" alt="VueDapp Brand" style="max-width:100%;" width="400">
  </a>
</p>

<br />

# Vue Dapp

- [Documentation (v0.5.x)](https://vue-dapp-docs.netlify.app/)
- [Migrate to v0.5.x](https://vue-dapp-docs.netlify.app/migration)

## Installation

```bash
yarn add ethers vue-dapp
```

## Quick Start

- If you're using [Vite](https://vitejs.dev/), please check out [Using Vite](https://vue-dapp-docs.netlify.app/using-vite.html) for more details on environment settings.
- Take a look at [vue3-dapp-starter](https://github.com/chnejohnson/vue3-dapp-starter) for a fast startup.

Step 1. add plugin to your app:

```javascript
import { VueDapp } from 'vue-dapp'

const app = createApp(App)

app.use(VueDapp)
...
```

Step 2. add `<vdapp-board />` component to your `App.vue`:

```vue
<vdapp-board :connectors="connectors" dark />
```

Step 3. construct your connectors and use composable functions in your scripts:

```js
import { MetaMaskConnector, WalletConnectConnector, CoinbaseWalletConnector } from 'vue-dapp'

const infuraId = '<your-infura-id>'

const connectors = [
  new MetaMaskConnector({
    appUrl: 'http://localhost:3000',
  }),
  new WalletConnectConnector({
    qrcode: true,
    rpc: {
      1: `https://mainnet.infura.io/v3/${infuraId}`,
      4: `https://rinkeby.infura.io/v3/${infuraId}`,
    },
  }),
  new CoinbaseWalletConnector({
    appName: 'Vue Dapp',
    jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
  }),
]
```

For more details, see https://github.com/chnejohnson/vue-dapp/blob/main/demo/src/App.vue

## Sponsor

Gitcoin Grants: https://gitcoin.co/grants/3987/vue-dapp

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present, Johnson Chen