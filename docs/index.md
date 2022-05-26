# Getting Started

## Installation

```bash
yarn add ethers vue-dapp
```

## Quick Start

:::tip
- If you're using [Vite](https://vitejs.dev/), please check out [Using Vite](/using-vite.html) for more details on environment settings.
- Use [vue3-dapp-starter](https://github.com/chnejohnson/vue3-dapp-starter) for a fast startup.
:::

Step 1. add plugin to your app:

```javascript
import { VueDapp } from 'vue-dapp'

const app = createApp(App)

app.use(VueDapp)
...
```

Step 2. add `<vd-board />` component to your `App.vue`:

```vue
<vd-board :connectors="connectors" dark />
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