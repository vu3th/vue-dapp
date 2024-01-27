import { Connector, ConnectorName } from './connector'
import { EIP1193Provider } from './eip1193'
import { EIP6963ProviderInfo } from './eip6963'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected'

export type Wallet = {
	status: ConnectionStatus
	error: string | null
	connectorName: ConnectorName | null
	provider: EIP1193Provider | null
	providerInfo: EIP6963ProviderInfo | null
	connector: Connector | null
	address: string | null
	chainId: number | null
}

export type OnDisconnectCallback = (...args: any[]) => void
export type OnAccountsChangedCallback = (accounts: string[]) => void
export type OnChainChangedCallback = (chainId: number) => void
