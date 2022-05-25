# useWallet

[source code](https://github.com/chnejohnson/vue-dapp/blob/main/src/composables/useWallet.ts)

## Usage

## Return Value
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