export enum ChainId {
  Hardhat = 31337,
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  xDai = 100,
  Rinkarby = 421611,
  Arbitrum = 42161,
  Polygon = 137,
}

export const CHAIN_NAMES = {
  [ChainId.Hardhat]: 'Hardhat',
  [ChainId.Mainnet]: 'Mainnet',
  [ChainId.Ropsten]: 'Ropsten',
  [ChainId.Kovan]: 'Kovan',
  [ChainId.Rinkeby]: 'Rinkeby',
  [ChainId.Goerli]: 'Goerli',
  [ChainId.xDai]: 'xDai',
  [ChainId.Rinkarby]: 'Rinkarby',
  [ChainId.Arbitrum]: 'Arbitrum',
  [ChainId.Polygon]: 'Polygon',
}

// @todo add other network details. Refer to https://chainlist.org/
export const NETWORK_DETAILS = {
  [ChainId.Arbitrum]: {
    chainId: '0x' + ChainId.Arbitrum.toString(16),
    chainName: 'Arbitrum',
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [ChainId.Rinkarby]: {
    chainId: '0x' + ChainId.Rinkarby.toString(16),
    chainName: 'RinkArby',
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://rinkeby-explorer.arbitrum.io'],
  },
  [ChainId.xDai]: {
    chainId: '0x' + ChainId.xDai.toString(16),
    chainName: 'xDAI',
    nativeCurrency: {
      symbol: 'xDAI',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
  },
  [ChainId.Polygon]: {
    chainId: '0x' + ChainId.Polygon.toString(16),
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
}
