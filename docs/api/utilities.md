# Utilities

[source code](https://github.com/chnejohnson/vue-dapp/tree/main/src/utils)

## Core

- `checkInfuraId` - return bool, send a request to infura node for checking
- `checkChainId` - return bool, check if chainId is ethereum network or xDai
- `shortenAddress`
- `displayEther`
- `displayChainName` - return lowercase name depends on chainId parameter

## Wallet API

[source code](https://github.com/chnejohnson/vue-dapp/tree/main/src/wallets)

### MetaMask

- `Metamask.switchChain(provider, chainId)`
- `Metamask.addChain(provider, networkDetails)`
