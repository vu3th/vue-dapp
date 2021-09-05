# Vue Dapp

Vue 3 composable and components library for building Dapps with ethers.js.

👀 [Demo](https://vue-dapp-demo.netlify.app/)

🌏 [Documentation](https://vue-dapp-docs.netlify.app/)

## Features
- TypeScript by default
- Demo ready to be written using [Vite](https://vitejs.dev/)

## Quick Start

Install dependencies:

```bash
npm install --save ethers vue-dapp

yarn add ethers vue-dapp
```

Add dependencies to your main.ts:

```javascript
import { VueDapp, Config } from 'vue-dapp'

const app = createApp(App)
const dappConfig: Partial<Config> = {
  infuraId: 'your-infura-id', // only for enabling WalletConnect
}

app.use(VueDapp, dappConfig)
...
```

Add the global component to your App.vue:

```vue
<board />
```

Use wallet or board from your .vue files:

```javascript
import { defineComponent } from 'vue'
import { useBoard, useEthers, useWallet } from 'vue-dapp'

export default defineComponent({
  name: 'App',
  inject: ['dappConfig'],
  setup() {
    const { open } = useBoard()
    const { status, disconnect, error } = useWallet()
    const { address } = useEthers()

    return {
      address,
      status,
      error,
      disconnect,
      open,
    }
  },
})
```

Add CDN in index.html for enabling WalletConnect:

```html
<body>
  <div id="app"></div>

  <!-- this line -->
  <script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.6.5/dist/umd/index.min.js"></script>
  <script type="module" src="/src/main.ts"></script>
</body>
```
(More about [issue of walletconnect](https://github.com/chnejohnson/vue-dapp/issues/3))

## Contributing

You are more than welcome to improve this project.

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