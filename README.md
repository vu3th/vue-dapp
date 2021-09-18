# Vue Dapp

Vue 3 library for building Dapps with ethers.js.

- [Documentation](https://vue-dapp-docs.netlify.app/)


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