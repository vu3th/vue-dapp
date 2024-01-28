import { AssertConnectedError } from '../errors'
import { Wallet, ConnWallet } from '../types'

export function assertConnected(wallet: Wallet, errMsg?: string): asserts wallet is ConnWallet {
	if (wallet.status !== 'connected') throw new AssertConnectedError(errMsg + ' - status')
	if (!wallet.connectorName) throw new AssertConnectedError(errMsg + ' - connectorName')
	if (!wallet.provider) throw new AssertConnectedError(errMsg + ' - provider')

	if (wallet.connectorName === 'BrowserWallet') {
		if (!wallet.providerInfo) throw new AssertConnectedError(errMsg + ' - providerInfo')
	}
	if (!wallet.connector) throw new AssertConnectedError(errMsg + ' - connector')
	if (!wallet.address) throw new AssertConnectedError(errMsg + ' - address')
	if (!wallet.chainId) throw new AssertConnectedError(errMsg + ' - chainId')
}
