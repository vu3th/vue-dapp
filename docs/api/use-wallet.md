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
        connector: {
            readonly name: string;
            readonly options: any;
            connect: () => Promise<Required<ConnectorData<any>>>;
            getProvider: () => Promise<providers.ExternalProvider | _coinbase_wallet_sdk.CoinbaseWalletProvider>;
            disconnect: () => Promise<void>;
            onDisconnect: (handler: (...args: any[]) => any) => void;
            onAccountsChanged: (handler: (accounts: string[]) => any) => void;
            onChainChanged: (handler: (chainId: number) => any) => void;
            switchChain?: ((chainId: number) => Promise<void>) | undefined;
        } | null;
        provider: {
            isMetaMask?: boolean | undefined;
            isStatus?: boolean | undefined;
            host?: string | undefined;
            path?: string | undefined;
            sendAsync?: ((request: {
                method: string;
                params?: any[] | undefined;
            }, callback: (error: any, response: any) => void) => void) | undefined;
            send?: ((request: {
                method: string;
                params?: any[] | undefined;
            }, callback: (error: any, response: any) => void) => void) | undefined;
            request?: ((request: {
                method: string;
                params?: any[] | undefined;
            }) => Promise<any>) | undefined;
        } | null;
        error: string;
        status: ConnectionStatus;
    };
    connectWith: (connector: Connector) => Promise<void>;
    disconnect: () => Promise<void>;
    autoConnect: (connectors: Connector[]) => Promise<void>;
    onDisconnect: (callback: OnDisconnectCallback) => void;
    onAccountsChanged: (callback: OnAccountsChangedCallback) => void;
    onChainChanged: (callback: OnChainChangedCallback) => void;
}
```