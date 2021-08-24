# (WIP) vue-dapp

Vue3 composable and component library for building Dapps.

👀 [Demo](https://vue-dapp-demo.netlify.app/)

🌏 [Documentation](https://vue-dapp-docs.netlify.app/)

## Features
- TypeScript by default
- Demo ready to be written using [Vite](https://vitejs.dev/)

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