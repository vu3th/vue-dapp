import { Connector, ConnectorName, ProviderTarget } from './connector'
import { EIP1193Provider } from './eip1193'
import { EIP6963ProviderInfo } from './eip6963'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected'

export type Wallet = {
	status: ConnectionStatus
	error: string | null
	connectorName: ConnectorName | null
	provider: EIP1193Provider | null
	connector: Connector | null
	address: string | null
	chainId: number | null
	providerInfo: EIP6963ProviderInfo | null // Only available when connectorName is 'BrowserWallet'
	providerTarget: ProviderTarget | null // Only available when connectorName is 'BrowserWallet'
}

export type OnDisconnectCallback = (...args: any[]) => void
export type OnAccountsChangedCallback = (accounts: string[]) => void
export type OnChainChangedCallback = (chainId: number) => void
