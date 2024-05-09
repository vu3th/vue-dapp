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
	providerTarget: ProviderTarget | null // Only available when connectorName is 'BrowserWallet'
	providerInfo: EIP6963ProviderInfo | null // Only available when connectorName is 'BrowserWallet' and providerTarget is 'rdns'
}

export type OnConnectedCB = (wallet: ConnWallet) => void
export type OnDisconnectedCB = () => void
