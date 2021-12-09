<p align="center">
  <a href="https://github.com/chnejohnson/vue-dapp/blob/main/demo/src/assets/logo.png">
    <img src="https://github.com/chnejohnson/vue-dapp/blob/main/demo/src/assets/logo.png" alt="VueDapp Brand" style="max-width:100%;" width="400">
  </a>
</p>

<br />

# Vue Dapp

- [Documentation (v0.4.2)](https://vue-dapp-docs.netlify.app/)

## Features

- Written in **TypeScript** for safe and efficient development.
- Demo written and bundled using [Vite](https://github.com/vitejs/vite)
- [Ethers.js](https://docs.ethers.io/v5/) for interacting with Ethereum.
- [Multicall2](https://github.com/makerdao/multicall) for calling multiple constant function into one request.

## Quick Start

Install dependencies:

```bash
yarn add ethers vue-dapp
```

Add plugin to your app:

```javascript
import { VueDapp } from 'vue-dapp'

const app = createApp(App)

app.use(VueDapp, {
  infuraId: '...', // optional: for enabling WalletConnect and/or WalletLink
  appName: '...', // optional: for enabling WalletLink
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

## Using Vite

If you're using Vite, you should have some settings:

1. Install following dependencies:

```
yarn add -D buffer process util
yarn add -D @rollup/plugin-inject
```

2. Add below settings in `vite.config.ts`:

```ts
import inject from '@rollup/plugin-inject'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
```

3. Add below scripts in `index.html`:

```html
<script>
  window.global = window
  let global = globalThis
</script>

<script type="module">
  import process from 'process'
  window.process = process
</script>

<script type="module">
  import buffer from 'buffer'
  window.Buffer = buffer.Buffer
</script>

<script type="module">
  import util from 'util'
  window.util = util
</script>
```

Refer to [issue#20](https://github.com/chnejohnson/vue-dapp/issues/20), and welcome to use [vue3-dapp-starter](https://github.com/chnejohnson/vue3-dapp-starter) directly.

## Contributing

Thanks for being interested in contributing to this project!

Just submit your changes via pull request and I will review them before merging.

If you are making a fix on the project, you can use the `main` branch and send a pull request.

If you are adding a new features, please create a new branch with a name describing your feature (`my-new-feature`), push to your branch and then submit a pull request.

## Inspiration

- [useDapp: Framework for rapid Dapp development.](https://github.com/EthWorks/useDApp)
- [vue-tailwind-ethereum-template](https://github.com/ScopeLift/vue-tailwind-ethereum-template)
- [web3Modal: A single Web3 / Ethereum provider solution for all Wallets](https://github.com/Web3Modal/web3modal)
- [vue3-eth: Vue3 library for building Dapps in an ES module environment](https://github.com/samatechtw/vue3-eth)

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present, Johnson Chen
