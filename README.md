<p align="center">
  <a href="https://github.com/chnejohnson/vue-dapp/blob/main/demo/src/assets/logo.png">
    <img src="https://github.com/chnejohnson/vue-dapp/blob/main/demo/src/assets/logo.png" alt="VueDapp Brand" style="max-width:100%;" width="400">
  </a>
</p>

<br />

# Vue Dapp

- [Documentation (v0.4.6)](https://vue-dapp-docs.netlify.app/)

## Features

- Written in **TypeScript** for safe and efficient development.
- Demo written and bundled using [Vite](https://github.com/vitejs/vite)
- [Ethers.js](https://docs.ethers.io/v5/) for interacting with Ethereum.
- [Multicall2](https://github.com/makerdao/multicall) for calling multiple constant function into one request.

## Installation

```sh
yarn add vue-dapp ethers
```

## Quick Start

- If you're using [Vite](https://vitejs.dev/), please check out [Using Vite](https://vue-dapp-docs.netlify.app/using-vite.html) for more details on environment settings.
- Use [vue3-dapp-starter](https://github.com/chnejohnson/vue3-dapp-starter) for a fast startup.

Step 1. Adding plugin to your app:

```javascript
import { VueDapp } from 'vue-dapp'

const app = createApp(App)

app.use(VueDapp, {
  infuraId: '...', // optional: for enabling WalletConnect and/or WalletLink
  appName: '...', // optional: for enabling WalletLink
})
...
```

Step 2. Adding global component `<vdapp-board />` to your App.vue:

```vue
<vdapp-board />
```

Step 3. Using composable functions in your script:

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

```

```
