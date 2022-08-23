import { AddEthereumChainParameter } from '../wallets'

export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
}

export const CHAIN_NAMES = {
  [ChainId.Mainnet]: 'Mainnet',
  [ChainId.Goerli]: 'Goerli',
}

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
