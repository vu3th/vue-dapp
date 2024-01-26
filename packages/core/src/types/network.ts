export { Connector } from './connector'

// Refer to https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
export interface NetworkDetails {
	chainId: string // A 0x-prefixed hexadecimal string
	chainName: string
	nativeCurrency: {
		name?: string
		symbol: string // 2-6 characters long
		decimals: number
	}
	rpcUrls: string[]
	blockExplorerUrls?: string[]
	iconUrls?: string[] // Currently ignored.
}

export type AddERC20TokenOptions = {
	address: string
	symbol: string
	decimals?: number
	image?: string
}
