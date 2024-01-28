import {
	Connector,
	toHex,
	ProviderNotFoundError,
	SwitchChainError,
	SwitchChainNotSupportedError,
	UserRejectedRequestError,
} from '@vue-dapp/core'
import {
	EthereumProviderOptions,
	EthereumProvider as IEthereumProvider,
} from '@walletconnect/ethereum-provider/dist/types/EthereumProvider'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ProviderRpcError, IProviderEvents } from '@walletconnect/ethereum-provider/dist/types/types'

export class WalletConnectConnector extends Connector<IEthereumProvider, EthereumProviderOptions> {
	readonly name = 'WalletConnect'
	#provider?: IEthereumProvider
	#onDisconnectHandler?: (args: ProviderRpcError) => void
	#onAccountsChangedHandler?: (accounts: string[]) => void
	#onChainChangedHandler?: (chainId: number) => void

	constructor(options: EthereumProviderOptions) {
		super(options)
	}

	async connect() {
		const provider: any = await this.getProvider()
		this.#provider = provider
		const accounts = await provider.enable()
		const account = accounts[0]

		// EthereumProvider's public state: https://github.com/WalletConnect/walletconnect-monorepo/blob/91af38edc2d2a99bae0b5b32f92607d221b74364/providers/ethereum-provider/src/EthereumProvider.ts#L221C10-L221C17
		const chainId = provider.chainId

		return {
			provider,
			account,
			chainId,
		}
	}

	async getProvider() {
		const provider = await EthereumProvider.init({
			...this.options,
		})

		provider.on('disconnect', (args: any) => {
			if (!provider.connected) {
				throw new UserRejectedRequestError(args.message)
			}
		})

		try {
			await provider.enable()
		} catch (err: any) {
			throw new Error(err)
		}

		return provider
	}

	async disconnect() {
		if (!this.#provider) throw new ProviderNotFoundError()
		await this.#provider.disconnect()
		this.#provider = undefined
	}

	onDisconnect(handler: (args: ProviderRpcError) => void) {
		if (!this.#provider) throw new ProviderNotFoundError()
		if (this.#onDisconnectHandler) {
			this.#removeListener('disconnect', this.#onDisconnectHandler)
		}
		this.#onDisconnectHandler = handler
		this.#provider.on('disconnect', this.#onDisconnectHandler)
	}

	onAccountsChanged(handler: (accounts: string[]) => void) {
		if (!this.#provider) throw new ProviderNotFoundError()
		if (this.#onAccountsChangedHandler) {
			this.#removeListener('accountsChanged', this.#onAccountsChangedHandler)
		}
		this.#onAccountsChangedHandler = handler
		this.#provider.on('accountsChanged', handler)
	}

	onChainChanged(handler: (chainId: number) => void) {
		if (!this.#provider) throw new ProviderNotFoundError()
		if (this.#onChainChangedHandler) {
			this.#removeListener('chainChanged', this.#onChainChangedHandler)
		}
		this.#onChainChangedHandler = handler
		this.#provider.on('chainChanged', (hexChainId: string) => {
			const chainId = parseInt(hexChainId, 16)

			if (this.options.rpcMap && this.options.rpcMap[chainId]) {
				handler(chainId)
			} else {
				// TODO: what's the best way to handle this?
				this.disconnect()
				window.location.reload()
				throw new Error('chain id not supported by connector')
			}
		})
	}

	#removeListener(event: IProviderEvents.Event, handler: (...args: any[]) => void) {
		if (!this.#provider) throw new ProviderNotFoundError()
		this.#provider.removeListener(event, handler)
	}

	/**
	 * @error Not support for WalletConnect v1.0
	 */
	async switchChain(chainId: number) {
		if (!this.#provider) throw new ProviderNotFoundError()
		if (!this.options.rpcMap?.[chainId]) {
			throw new SwitchChainNotSupportedError()
		}

		const id = toHex(chainId)

		try {
			await this.#provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: id }],
			})
		} catch (error: unknown) {
			const message = typeof error === 'string' ? error : (<ProviderRpcError>error)?.message
			if (/user rejected request/i.test(message)) {
				throw new UserRejectedRequestError(error)
			}
			throw new SwitchChainError(error)
		}
	}
}
