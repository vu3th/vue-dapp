# Utilities

[source code](https://github.com/chnejohnson/vue-dapp/tree/main/src/utils)

## Core

- `checkInfuraId` - return bool, send a request to infura node for checking
- `checkChainId` - return bool, check if chainId is ethereum network or xDai
- `shortenAddress`
- `displayEther`
- `displayChainName` - return lowercase name depends on chainId parameter

### MetaMask API

[source code](https://github.com/chnejohnson/vue-dapp/tree/main/src/wallets/metamask.ts)

- `Metamask.switchChain(provider, chainId)`
- `Metamask.addChain(provider, networkDetails)`

#### Example

```ts
import {
  useEthers,
  useWallet,
  Metamask,
  MetaMaskProvider,
  ChainId,
} from 'vue-dapp'

export default defineComponent({
  setup() {
    const { isActivated } = useEthers()
    const { walletName, provider } = useWallet()

    const switchChain = (chainId: number) => {
      if (isActivated.value && walletName.value === 'metamask' && chainId !== ChainId.Hardhat) {
        Metamask.switchChain(provider.value as MetaMaskProvider, chainId)
      }
    }
  },
})
```
