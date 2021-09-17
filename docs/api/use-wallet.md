# useWallet

[source code](https://github.com/chnejohnson/vue-dapp/blob/main/src/composables/useWallet.ts)

## Types
```typescript
declare function useWallet(options?: UseWalletOptions): {
    provider: Ref<WalletProvider | null>;
    status: Ref<ConnectionState>;
    walletName: Ref<WalletName>;
    error: Ref<string>;
    isConnected: vue_demi.ComputedRef<boolean>;
    connect: (_walletName: WalletName, infuraAPI?: string | undefined) => Promise<void>;
    disconnect: () => Promise<void>;
    onDisconnect: (callback: OnDisconnectCallback) => void;
    onAccountsChanged: (callback: OnAccountsChangedCallback) => void;
    onChainChanged: (callback: OnChainChangedCallback) => void;
};

declare type UseWalletOptions = {
    library: 'ethers' | 'web3';
};
```

## Core

These state store globally outside the function `useWallet`.

- `provider` - wallet provider, see below
- `status` - none, connecting, and connected
- `walletName` - metamask or walletconnect
- `error` - connect error
- `isConnected` - computed from status.connected

#### Status
`status: Ref<ConnectionState>;`

```ts
type ConnectionState = 'none' | 'connecting' | 'connected';
```

#### Wallet Name
`walletName: Ref<WalletName>;`
```ts
type WalletName = 'none' | 'metamask' | 'walletconnect';
```


#### Wallet Provider
Wallet provider is an object provided by wallet source, like MetaMask or WalletConnect.


`provider: Ref<WalletProvider>;`


```ts
type WalletProvider = MetaMaskProvider | WalletConnectProvider | null;
```

**MetaMask Provider**
- More on [MetaMask Docs](https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents)
- For using `request` like `ethereum.request({ method: 'eth_chainId' })`, see [MetaMask JSON-RPC API](https://metamask.github.io/api-playground/api-documentation/)

**WalletConnect Provider**
- More on [WalletConnect Docs](https://docs.walletconnect.org/quick-start/dapps/web3-provider)
- For testing by web, using [Test Wallet](https://test.walletconnect.org/)
- [source code](https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts)




## Examples

Example 1 -  [source](https://github.com/chnejohnson/vue-dapp/blob/main/src/components/Board.vue)

```ts
import { defineComponent } from 'vue'
import { useWallet } from 'vue-dapp'

export default defineComponent({
  name: 'App',
  setup() {
    const { connect, status } = useWallet()

    const connectMetamask = async () => {
      connect('metamask')
    }

    const connectWalletconnect = async () => {
      connect('walletconnect', infuraId)
    }

    return {
      connectMetamask,
      connectWalletconnect,
    }
  },
})
```

Example 2
```ts
const { onAccountsChanged, onChainChanged } = useWallet()

onAccountsChanged(() => {
  notify({
    text: 'Account Changed',
  })
})

onChainChanged(() => {
  notify({
    text: 'Chain Changed',
  })
})
```