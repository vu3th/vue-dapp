// TODO: deprecated

/**
 * MetaMask
 * Docs: https://docs.metamask.io/guide/ethereum-provider.html
 * JSON RPC API: https://metamask.github.io/api-playground/api-documentation
 */
export interface MetaMaskProvider extends MetaMaskEthereumProvider {
	isMetaMask: boolean
	providers?: MetaMaskProvider[]
	isConnected: () => boolean
	request: (request: { method: string; params?: any[] | undefined }) => Promise<any>
}

/**
 * source: @metamask/detect-provider
 * https://github.com/MetaMask/detect-provider/blob/main/src/index.ts
 */
export interface MetaMaskEthereumProvider {
	isMetaMask?: boolean
	once(eventName: string | symbol, listener: (...args: any[]) => void): this
	on(eventName: string | symbol, listener: (...args: any[]) => void): this
	off(eventName: string | symbol, listener: (...args: any[]) => void): this
	addListener(eventName: string | symbol, listener: (...args: any[]) => void): this
	removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this
	removeAllListeners(event?: string | symbol): this
}
