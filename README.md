# (WIP) vue-dapp

Vue3 composable and component library for building Dapps.

👀 [Demo](https://vue-dapp-demo.netlify.app/)

🌏 Documentation

## Features
- TypeScript by default
- Vue as peer dependency (minimal bundle size)
- Vue 2 & 3 support using [vue-demi](https://github.com/antfu/vue-demi)
- Testing using [Jest](https://jestjs.io)
- Exports **cjs**, **esm** and **global** bundles
- Demo ready to be written and bundled using [Vite](https://vitejs.dev/)
- Edit variables, implement, test, publish

## Quick Start
```javascript
import { defineComponent } from 'vue'
import { useWallet, Wallet } from 'vue-dapp'

export default defineComponent({
  name: 'App',
  setup() {
    const { connect, address, fixedBalance, isConnected, disconnect } = useWallet()

    const connectMetamask = async () => {
      await connect(Wallet.metamask)
    }

    return {
      address,
      isConnected,
      fixedBalance,
      connectMetamask,
    }
  },
})
```

## Contributing

You are more than welcome to improve this project.

Just submit your changes via pull request and I will review them before merging.

If you are making a fix on the project, you can use the `main` branch and send a pull request.

If you are adding a new features, please create a new branch with a name describing your feature (`my-new-feature`), push to your branch and then submit a pull request.


## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present, Johnson Chen