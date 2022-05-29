# Connectors

[source code](https://github.com/chnejohnson/vue-dapp/tree/main/src/wallets)

## Connector Interface

```ts
declare abstract class Connector<Provider = providers.ExternalProvider, Options = any> {
    abstract readonly name: string;
    readonly options: Options;
    constructor(options: Options);
    abstract connect(): Promise<Required<ConnectorData>>;
    abstract getProvider(): Promise<Provider>;
    abstract disconnect(): Promise<void>;
    abstract onDisconnect(handler: (...args: any[]) => any): void;
    abstract onAccountsChanged(handler: (accounts: string[]) => any): void;
    abstract onChainChanged(handler: (chainId: number) => any): void;
    abstract switchChain(chainId: number): Promise<void>;
}
```

## MetaMaskConnector

The MetaMaskConnector supports connecting with MetaMask.
* Docs: https://docs.metamask.io/guide/ethereum-provider.html
* JSON RPC API: https://metamask.github.io/api-playground/api-documentation

### Usage
```ts
const connector = new MetaMaskConnector({
    appUrl: 'http://localhost:3000',
}),
```

### Configuration
- `appUrl` (optional): Add deep link to MetaMask wallet on mobile device, see https://github.com/chnejohnson/vue-dapp/pull/29

## WalletConnectConnector
The WalletConnectConnector supports connecting with WalletConnect.

For more details, see WalletConnect v1.0 docs
* Docs: https://docs.walletconnect.com/quick-start/dapps/web3-provider
* Test Wallet: https://test.walletconnect.org/
* Source: https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts

### Usage
```ts
const connector = new WalletConnectConnector({
  qrcode: true,
  rpc: {
    1: `https://mainnet.infura.io/v3/${infuraId}`,
    4: `https://rinkeby.infura.io/v3/${infuraId}`,
  },
})
```


## Coinbase Wallet
The CoinbaseWalletConnector supports connecting with Coinbase Wallet using the [Coinbase Wallet SDK](https://docs.cloud.coinbase.com/wallet-sdk/docs/)

### Usage
```ts
const connector = new CoinbaseWalletConnector({
  appName: 'Vue Dapp',
  jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
})
```


