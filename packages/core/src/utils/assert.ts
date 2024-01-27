import { AssertConnectedError } from '../errors'
import { Wallet, WalletConnected } from '../types'

export function assertConnected(wallet: Wallet, errMsg?: string): asserts wallet is WalletConnected {
	if (wallet.status === 'connected') throw new AssertConnectedError(errMsg)
	if (!wallet.connectorName) throw new AssertConnectedError(errMsg)
	if (!wallet.provider) throw new AssertConnectedError(errMsg)

	if (wallet.connectorName === 'BrowserWallet') {
		if (!wallet.providerInfo) throw new AssertConnectedError(errMsg)
	}
	if (!wallet.connector) throw new AssertConnectedError(errMsg)
	if (!wallet.address) throw new AssertConnectedError(errMsg)
	if (!wallet.chainId) throw new AssertConnectedError(errMsg)
}
