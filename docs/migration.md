# Migrating to v0.5.x

If you are coming from an earlier version of vue-dapp, in order to update to versions above 0.5.x, you will need to make sure to update the following code.

## Breaking changes

- You have to construct your connectors and configure third-party providers as your wallet options on board.
- Pass your connectors to `<vd-board :connectors="connectors">`
- You don't need to add plugin options anymore.

### Before

```ts
// main.ts
app.use(VueDapp, {
  infuraId: '...',
  appName: '...',
  appUrl: '...',
})
```

App.vue
```vue
<template>
  <vd-board />
<template />
```

### After

```ts
// main.ts
app.use(VueDapp)

// App.vue
import { MetaMaskConnector, WalletConnectConnector, CoinbaseWalletConnector } from 'vue-dapp'

const infuraId = ''

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

App.vue

```vue
<template>
  <vd-board :connectors="connectors" dark />
</template>
```