# Connectors

[source code](https://github.com/vu3th/vue-dapp/tree/main/src/connectors)

## Connector Interface

```ts
declare abstract class Connector<Provider = providers.ExternalProvider | CoinbaseWalletProvider, Options = any> {
    abstract readonly name: string;
    readonly options: Options;
    constructor(options: Options);
    abstract connect(): Promise<Required<ConnectorData>>;
    abstract getProvider(): Promise<Provider>;
    abstract disconnect(): Promise<void>;
    abstract onDisconnect(handler: (...args: any[]) => any): void;
    abstract onAccountsChanged(handler: (accounts: string[]) => any): void;
    abstract onChainChanged(handler: (chainId: number) => any): void;
    switchChain?(chainId: number): Promise<void>;
}
declare type ConnectorData<Provider = any> = {
    account: string;
    provider: Provider;
};
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
- `appUrl` (optional): Add deep link to MetaMask wallet on mobile device, see https://github.com/vu3th/vue-dapp/pull/29


### Types 
```ts
/**
 * MetaMask
 * Docs: https://docs.metamask.io/guide/ethereum-provider.html
 * JSON RPC API: https://metamask.github.io/api-playground/api-documentation
 */
interface MetaMaskProvider extends MetaMaskEthereumProvider {
    isMetaMask: boolean;
    providers?: MetaMaskProvider[];
    isConnected: () => boolean;
    request: (request: {
        method: string;
        params?: any[] | undefined;
    }) => Promise<any>;
    selectedAddress: string;
}
/**
 * source: @metamask/detect-provider
 * https://github.com/MetaMask/detect-provider/blob/main/src/index.ts
 */
interface MetaMaskEthereumProvider {
    isMetaMask?: boolean;
    once(eventName: string | symbol, listener: (...args: any[]) => void): this;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
    off(eventName: string | symbol, listener: (...args: any[]) => void): this;
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
}
interface Window {
    ethereum?: MetaMaskProvider;
}
declare type MetaMaskConnectorOptions = {
    appUrl?: string;
};
declare class MetaMaskConnector extends Connector<MetaMaskProvider, MetaMaskConnectorOptions> {
    #private;
    readonly name = "metaMask";
    constructor(options?: MetaMaskConnectorOptions);
    static checkConnection(): Promise<boolean>;
    connect(): Promise<{
        account: any;
        provider: MetaMaskProvider;
    }>;
    getProvider(): Promise<MetaMaskProvider>;
    /**
     * MetaMask do not support programmatic disconnect.
     * @see https://github.com/MetaMask/metamask-extension/issues/10353
     */
    disconnect(): Promise<void>;
    /**
     * @note MetaMask disconnect event would be triggered when the specific chain changed (like L2 network),
     * and will not be triggered when a user clicked disconnect in wallet...
     */
    onDisconnect(handler: (error: ProviderRpcError) => void): void;
    onAccountsChanged(handler: (accounts: string[]) => void): void;
    onChainChanged(handler: (chainId: number) => void): void;
    switchChain(chainId: number): Promise<void>;
    addChain(networkDetails: AddEthereumChainParameter): Promise<void>;
}
interface AddEthereumChainParameter {
    chainId: string;
    chainName: string;
    nativeCurrency: {
        name?: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[];
}
```
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

### Types
```ts
/**
 * WalletConnect v1.0 \
 * Docs: https://docs.walletconnect.com/quick-start/dapps/web3-provider \
 * Test Wallet: https://test.walletconnect.org/ \
 * Source: https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts
 */
interface IWalletConnectProvider extends WalletConnectProvider {
}
declare type WalletConnectOptions = ConstructorParameters<typeof WalletConnectProvider>[0];
declare class WalletConnectConnector extends Connector<WalletConnectProvider, WalletConnectOptions> {
    #private;
    readonly name = "walletConnect";
    constructor(options: WalletConnectOptions);
    connect(): Promise<{
        account: string;
        provider: WalletConnectProvider;
    }>;
    getProvider(): Promise<WalletConnectProvider>;
    disconnect(): Promise<void>;
    onDisconnect(handler: (code: number, reason: string) => void): void;
    onAccountsChanged(handler: (accounts: string[]) => void): void;
    onChainChanged(handler: (chainId: number) => void): void;
    /**
     * @error Not support for WalletConnect v1.0
     */
    switchChain(chainId: number): Promise<void>;
}
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

### Types 
```ts
/**
 * Coinbase Wallet SDK
 * Docs: https://docs.cloud.coinbase.com/wallet-sdk/docs/
 */
interface ICoinbaseWalletProvider extends CoinbaseWalletProvider {
}
declare type CoinbaseWalletConnectorOptions = CoinbaseWalletSDKOptions & {
    jsonRpcUrl: string;
    chainId?: number;
};
declare class CoinbaseWalletConnector extends Connector<CoinbaseWalletProvider, CoinbaseWalletConnectorOptions> {
    #private;
    readonly name = "coinbaseWallet";
    constructor(options: CoinbaseWalletConnectorOptions);
    connect(): Promise<{
        account: string;
        provider: CoinbaseWalletProvider;
    }>;
    getProvider(): Promise<CoinbaseWalletProvider>;
    disconnect(): Promise<void>;
    /**
     * @note CoinbaseWallet will reload page if it disconnected by wallet app.
     * @todo experiment with the browser extension
     */
    onDisconnect(handler: () => void): void;
    onAccountsChanged(handler: (accounts: string[]) => void): void;
    onChainChanged(handler: (chainId: number) => void): void;
    /**
     * @todo: add addChain()
     */
    switchChain(chainId: number): Promise<void>;
}
```

## Gnosis Safe
The SafeConnector supports running your Dapp inside the [Safe App](https://gnosis-safe.io/app/) with [Safe Apps SDK](https://docs.gnosis-safe.io/build/sdks)

### Usage
```ts
const safe = new SafeConnector()
```


### Types
```ts
declare const isServer: boolean;
declare const isIframe: boolean;
declare const isNotSafeApp: () => boolean;
declare class SafeConnector extends Connector<SafeAppProvider, Opts> {
    #private;
    readonly name = "safe";
    ready: boolean;
    constructor(options?: Opts);
    connect(): Promise<{
        account: string;
        provider: SafeAppProvider;
    }>;
    getProvider(): Promise<SafeAppProvider>;
    isSafeApp(): Promise<boolean>;
    disconnect(): Promise<void>;
    onDisconnect(handler: (error: ProviderRpcError) => void): void;
    onAccountsChanged(handler: (accounts: string[]) => void): void;
    onChainChanged(handler: (chainId: number) => void): void;
}
```