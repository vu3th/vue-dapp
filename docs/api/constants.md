# Constants

[source code](https://github.com/vu3th/vue-dapp/blob/main/src/constants/chainId.ts)

## ChainId

```ts
export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
}
```

## CHAIN_NAMES
```ts
export const CHAIN_NAMES = {
  [ChainId.Mainnet]: 'Mainnet',
  [ChainId.Goerli]: 'Goerli',
}
```

## NETWORK_DETAILS

```ts
export const NETWORK_DETAILS: { [key: number]: AddEthereumChainParameter } = {
  [ChainId.Mainnet]: {
    chainId: '0x' + ChainId.Mainnet.toString(16),
    chainName: 'Mainnet',
    rpcUrls: [
      'https://cloudflare-eth.com',
      'https://rpc.ankr.com/eth',
      'https://main-rpc.linkpool.io',
    ],
    blockExplorerUrls: ['https://etherscan.io'],
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
  },

  [ChainId.Goerli]: {
    chainId: '0x' + ChainId.Goerli.toString(16),
    chainName: 'Goerli',
    rpcUrls: ['https://goerli.optimism.io'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
  },
}
```