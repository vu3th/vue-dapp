import { Connector, ConnectorName } from './connector'
import { EIP1193Provider } from './eip1193'
import { EIP6963ProviderInfo } from './eip6963'

export type ConnWallet = {
	status: 'connected'
	error: null
	connectorName: ConnectorName
	provider: EIP1193Provider
	providerInfo: EIP6963ProviderInfo | null // if the connector is not BrowserWallet, this will be null
	connector: Connector
	address: string
	chainId: number
}

export type OnConnectedCB = (wallet: ConnWallet) => void
export type OnAccountOrChainIdChangedCB = (wallet: ConnWallet) => void
export type OnDisconnectedCB = () => void

export type OnWalletUpdatedCB = (wallet: ConnWallet) => void
