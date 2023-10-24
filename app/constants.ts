import type { Chain } from 'viem'
import { mainnet, arbitrum, arbitrumGoerli, optimism } from 'viem/chains'

export type AppNetwork = 'mainnet' | 'arbitrum' | 'optimism' | 'arbitrum-goerli'

export const networkMap = new Map<AppNetwork, Chain>()

networkMap.set('mainnet', mainnet)
networkMap.set('arbitrum', arbitrum)
networkMap.set('optimism', optimism)
networkMap.set('arbitrum-goerli', arbitrumGoerli)

export const APP_NAME = 'Vue Dapp'

export const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'

export const HARDHAT_PRIV_KEY = [
	'', // #0
	'', // #1
	'',
	'',
	'',
	'', // #5
	'',
	'',
	'',
	'',
	'', // #10,
	'',
	'0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1',
]
