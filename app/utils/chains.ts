export type Chain = {
	chainId: number
	chainName: string
	nativeCurrency: {
		symbol: string
		decimals: number
	}
	rpcUrls: string[]
	blockExplorerUrls: string[]
}
export const chains: {
	[key: number]: Chain
} = {
	1: {
		chainId: 1,
		chainName: 'Ethereum',
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://ethereum-rpc.publicnode.com/'],
		blockExplorerUrls: ['https://etherscan.io/'],
	},

	11155111: {
		chainId: 11155111,
		chainName: 'Sepolia',
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com/'],
		blockExplorerUrls: ['https://sepolia.etherscan.io/'],
	},

	42161: {
		chainId: 42161,
		chainName: 'Arbitrum',
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://arbitrum-one-rpc.publicnode.com/'],
		blockExplorerUrls: ['https://arbiscan.io/'],
	},

	421614: {
		chainId: 421614,
		chainName: 'Arbitrum Sepolia',
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://arbitrum-sepolia-rpc.publicnode.com/'],
		blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
	},
}
