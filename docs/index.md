# Getting Started

## Installation

npm

```bash
npm install --save vue-dapp
```

yarn

```bash
yarn add vue-dapp
```

## Quick Start

Adding plugin to your app:

```javascript
import { VueDapp } from 'vue-dapp'

const app = createApp(App)

app.use(VueDapp, {
  infuraId: '...', // optional: for enabling WalletConnect and/or WalletLink
  appName: '...', // optional: for enabling WalletLink
  appUrl: '...', // optional: for enabling MetaMask deep link for mobile devices
})
...
```

Adding global component `<vdapp-board />` to your App.vue:

```vue
<vdapp-board />
```

:::tip
If you're using [Vite](https://vitejs.dev/), please check out [Using Vite](./using-vite.md) for more details.
:::

Using `useBoard`, `useWallet`, and `useEthers` in your script:

```js
import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
} from 'vue-dapp'

const { open } = useBoard()
const { status, disconnect, error } = useWallet()
const { address, balance, chainId, isActivated } = useEthers()
```

Scaffolding Your Dapp UI:

```vue
<template>
  <div class="h-full flex flex-col justify-center items-center">
    <p v-if="error" class="text-red-500">{{ error }}</p>

    <div v-if="isActivated" class="text-center">
      <p>{{ shortenAddress(address) }}</p>
      <p>{{ displayEther(balance) }} ETH</p>
      <p>
        network:
        <span class="capitalize">
          {{ displayChainName(chainId) }}
        </span>
      </p>
    </div>

    <div class="m-4">
      <button
        @click="isActivated ? disconnect() : open()"
        class="btn"
        :disabled="status === 'connecting'"
      >
        {{
          status === 'connected'
            ? 'Disconnect'
            : status === 'connecting'
            ? 'Connecting...'
            : 'Connect'
        }}
      </button>
    </div>
  </div>
  <vdapp-board />
</template>
```
