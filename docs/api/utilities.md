# Utilities

[source code](https://github.com/chnejohnson/vue-dapp/tree/main/src/utils)

## Core
- `checkInfuraId` - return bool, send a request to infura node for checking
- `checkChainId` - return bool, check if chainId is ethereum network or xDai
- `shortenAddress`
- `displayEther`
- `displayChainName` - return lowercase name depends on chainId parameter

## Constants
```ts
export enum ChainId {
  Hardhat = 31337,
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  xDai = 100,
}

export const CHAIN_NAMES = {
  [ChainId.Hardhat]: 'Hardhat',
  [ChainId.Mainnet]: 'Mainnet',
  [ChainId.Ropsten]: 'Ropsten',
  [ChainId.Kovan]: 'Kovan',
  [ChainId.Rinkeby]: 'Rinkeby',
  [ChainId.Goerli]: 'Goerli',
  [ChainId.xDai]: 'xDai',
}

```