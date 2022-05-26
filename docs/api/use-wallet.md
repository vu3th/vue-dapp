# useWallet

Hook for accessing the connected wallet.

[source code](https://github.com/chnejohnson/vue-dapp/blob/main/src/composables/useWallet.ts)

## Usage

```ts
const { wallet, disconnect, onDisconnect, onAccountsChanged, onChainChanged } = useWallet()

onDisconnect(() => {
  console.log('disconnect')
})

onAccountsChanged(() => {
  console.log('accounts changed')
})

onChainChanged((chainId: any) => {
  console.log('chain changed', chainId)
})

return {
    wallet
}
```

## Return Value
```typescript
{
    wallet: {
        connector: Connector | null;
        provider: providers.ExternalProvider | null;
        error: string;
        status: 'none' | 'connecting' | 'loading' | 'connected';
    };
    connectWith: (connector: Connector) => Promise<void>;
    disconnect: () => Promise<void>;
    onDisconnect: (callback: OnDisconnectCallback) => void;
    onAccountsChanged: (callback: OnAccountsChangedCallback) => void;
    onChainChanged: (callback: OnChainChangedCallback) => void;
}
```