# useWallet

<!-- ## Parameters -->

<!-- ### `target`

Target must be an element (**SVG** / **HTML**), or a reference to an element.

If the target **reference** is **updated**, the **current** style will be **updated** from the new **element** styling. -->



## Returns
### State

These state store globally in the Dapp.

#### `provider: Ref<WalletProvider>;`
```ts
type WalletProvider = MetaMaskProvider | WalletConnectProvider | null;
```
**MetaMask**
- For `MetaMaskProvider`, see [MetaMask Docs](https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents)
- For using `request` like `provider.request({ method: 'eth_chainId' })`, see [MetaMask JSON-RPC API](https://metamask.github.io/api-playground/api-documentation/)
#### `status: Ref<ConnectionState>;`

**WalletConnect**
- For testing by web, using [this site](https://test.walletconnect.org/)
- [WalletConnect Docs](https://docs.walletconnect.org/quick-start/dapps/web3-provider)
- `WalletConnectProvider` [source code](https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts)

```ts
type ConnectionState = 'none' | 'connecting' | 'connected';
```
#### `walletName: Ref<WalletName>;`
```ts
type WalletName = 'none' | 'metamask' | 'walletconnect';

```
#### `error: Ref<string>;`

### Methods
#### `connect`

```ts
connect('metamask')
connect('walletconnect', infuraId)
```
#### `disconnect`

[Web3Provider](https://docs.ethers.io/v5/api/providers/other/#Web3Provider)

## Types
```typescript
declare function useWallet(): {
    provider: Ref<WalletProvider>;
    status: Ref<ConnectionState>;
    walletName: Ref<WalletName>;
    error: Ref<string>;
    connect: (_walletName: WalletName, infuraAPI?: string | undefined) => Promise<void>;
    disconnect: () => Promise<void>;
};
```

## Example

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