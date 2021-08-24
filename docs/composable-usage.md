# Composable Usage

**vue-dapp** is written using Composition API.

## Your first useWallet

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