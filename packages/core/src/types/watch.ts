import { EIP1193Provider } from './eip1193'

export type WalletContext = {
	// export walletState?
	provider: EIP1193Provider
	address: string
	chainId: number
}

export type OnConnectedCB = (context: WalletContext) => void
export type OnAccountOrChainIdChangedCB = (context: WalletContext) => void
export type OnDisconnectedCB = () => void
export type OnWalletUpdatedCB = (context: WalletContext) => void
