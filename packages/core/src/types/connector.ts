import { EIP1193Provider } from './eip1193'
import { EIP6963ProviderInfo } from './eip6963'

export type ConnectorName = 'BrowserWallet' | 'WalletConnect' | 'CoinbaseWallet'
export type ProviderTarget = 'window.ethereum' | 'rdns' // only for BrowserWalletConnector

export type ConnectorData<Provider = any> = {
	provider: Provider
	account: string
	chainId: number
	info?: EIP6963ProviderInfo // Only available for BrowserWalletConnector
}

export type ConnectOptions = {
	target?: ProviderTarget
	rdns?: string
	timeout?: number
}

export abstract class Connector<Provider = EIP1193Provider, Options = any> {
	// Connector name
	abstract readonly name: string
	// Options to pass to the third-party provider
	readonly options: Options

	constructor(options: Options) {
		this.options = options
	}

	abstract connect(optionsOrTimeout?: ConnectOptions | number): Promise<ConnectorData>

	abstract getProvider(): Promise<Provider> | { provider: EIP1193Provider; info?: EIP6963ProviderInfo }

	abstract disconnect(): Promise<void>
	abstract onDisconnect(handler: (...args: any[]) => any): void
	abstract onAccountsChanged(handler: (accounts: string[]) => any): void
	abstract onChainChanged(handler: (chainId: number) => any): void

	switchChain?(chainId: number, ...args: any[]): Promise<void>
}
