# Getting Started

## Installation

NPM
```sh
npm install --save ethers vue-dapp
```

YARN
```sh
yarn add ethers vue-dapp
```

## Quick Start
Add plugin to your app:

```javascript
import { VueDapp } from 'vue-dapp'

const app = createApp(App)

app.use(VueDapp, {
  infuraId: '...', // optional: for enabling WalletConnect
})
...
```

Add the global component to your App.vue:

```vue
<vdapp-board />
```

Use board, wallet, and ethers from your setup:

```javascript
import { defineComponent } from 'vue'
import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
} from 'vue-dapp'

export default defineComponent({
  name: 'App',
  setup() {
    const { open } = useBoard()
    const { status, disconnect, error } = useWallet()
    const { address, balance, chainId, isActivated } = useEthers()

    return {
      isActivated,
      address,
      status,
      error,
      chainId,
      balance,
      open,
      disconnect,
      displayEther,
      displayChainName,
      shortenAddress,
    }
  },
})
```

Optional: add CDN in index.html for enabling WalletConnect:

```html
<body>
  <div id="app"></div>

  <!-- this line -->
  <script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.6.5/dist/umd/index.min.js"></script>
  <script type="module" src="/src/main.ts"></script>
</body>
```

Now you can create your interface! 

```vue
<template>
  <div class="h-full flex flex-col justify-center items-center">
    <p
      v-if="error"
      class="text-red-500"
    >{{ error }}</p>

    <div
      v-if="isActivated"
      class="text-center"
    >
      <p>{{ shortenAddress(address) }}</p>
      <p>{{ displayEther(balance) }} ETH</p>
      <p>network: <span class="capitalize"> {{ chainId ? displayChainName(chainId) : '' }} </span></p>
    </div>

    <div class="m-4">
      <button
        @click="isActivated ? disconnect() : open()"
        class="btn"
        :disabled="status === 'connecting'"
      >{{ status === 'connected' ? "Disconnect" : status === 'connecting' ? "Connecting..." : "Connect" }}</button>
    </div>
  </div>
  <vdapp-board />
</template>
```
