import { Connector, ConnectorName, ProviderTarget } from './connector'
import { EIP1193Provider } from './eip1193'
import { EIP6963ProviderInfo } from './eip6963'

export type ConnWallet = {
	status: 'connected'
	error: null
	connectorName: ConnectorName
	provider: EIP1193Provider
	connector: Connector
	address: string
	chainId: number
	providerInfo: EIP6963ProviderInfo | null // Only available when connectorName is 'BrowserWallet'
	providerTarget: ProviderTarget | null // Only available when connectorName is 'BrowserWallet'
}

export type OnConnectedCB = (wallet: ConnWallet) => void
export type OnAccountOrChainIdChangedCB = (wallet: ConnWallet) => void
export type OnDisconnectedCB = () => void

export type OnWalletUpdatedCB = (wallet: ConnWallet) => void
