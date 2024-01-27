import {
	Connector,
	NetworkDetails,
	AddERC20TokenOptions,
	EIP1193Provider,
	ConnectOptions,
	RDNS,
	EIP6963ProviderDetail,
} from './types'
import {
	AddChainError,
	ProviderRpcError,
	ProviderNotFoundError,
	UserRejectedRequestError,
	SwitchChainError,
} from './errors'
import { normalizeChainId, toHex } from './utils'
import { useEIP6963 } from './useEIP6963'

export type BrowserWalletConnectorOptions = {
	appUrl?: string
}

export class BrowserWalletConnector extends Connector<EIP1193Provider, BrowserWalletConnectorOptions> {
	readonly name = 'BrowserWallet'

	provider?: EIP1193Provider
	onDisconnectHandler?: (error: ProviderRpcError) => void
	onAccountsChangedHandler?: (accounts: string[]) => void
	onChainChangedHandler?: (chainId: number) => void

	constructor(options: BrowserWalletConnectorOptions = {}) {
		super(options)

		useEIP6963().subscribe()
	}

	static async checkConnection() {
		if (typeof window !== 'undefined' && !!window.ethereum) {
			const provider = window.ethereum as EIP1193Provider
			if ((await provider.request({ method: 'eth_accounts' })).length !== 0) {
				return true
			}
		}
		return false
	}

	async connect(options: ConnectOptions) {
		// console.log('connect', options)

		const { timeout, rdns } = options

		const { info, provider } = this.getProvider(rdns)

		console.log('BrowserWalletConnector.connect -> provider', provider)
		// console.log('BrowserWalletConnector.connect -> info', info)

		let accounts, chainId

		try {
			if (timeout) {
				accounts = await Promise.race([
					provider.request({
						method: 'eth_requestAccounts',
						params: [{ eth_accounts: {} }],
					}),
					new Promise<void>((_, reject) =>
						setTimeout(() => {
							reject(new Error('timeout'))
						}, timeout),
					),
				])
			} else {
				accounts = await provider.request({
					method: 'eth_requestAccounts',
					params: [{ eth_accounts: {} }],
				})
			}

			chainId = (await provider.request({
				method: 'eth_chainId',
			})) as number
		} catch (error: any) {
			throw new Error(`Failed to request MetaMask${error.message ? ': ' + error.message : ''}`)
		}

		this.provider = provider

		return {
			provider: this.provider,
			account: accounts[0],
			chainId,
			info,
		}
	}

	getProvider(rdns?: RDNS | string): EIP6963ProviderDetail {
		const { providerDetails } = useEIP6963()
		if (providerDetails.value.length < 1) throw new ProviderNotFoundError()

		// without rdns, return the first provider
		if (!rdns) {
			if (providerDetails.value.length === 1) {
				return providerDetails.value[0]
			}

			if (providerDetails.value.length > 1) {
				const metamaskProviderDetail = providerDetails.value.find(({ info }) => info.rdns === RDNS.metamask)
				if (metamaskProviderDetail) return metamaskProviderDetail
				return providerDetails.value[0]
			}
		}

		// with rdns, return the provider with the same rdns
		if (providerDetails.value.length > 1) {
			const detail = providerDetails.value.find(({ info }) => info.rdns === rdns)
			if (!detail) throw new ProviderNotFoundError()
			return detail
		}

		throw new ProviderNotFoundError()
	}

	/**
	 * MetaMask do not support programmatic disconnect.
	 * @see https://github.com/MetaMask/metamask-extension/issues/10353
	 */
	async disconnect() {
		if (!this.provider) throw new ProviderNotFoundError()

		this.onDisconnectHandler && this.#removeListener('disconnect', this.onDisconnectHandler)
		this.onAccountsChangedHandler && this.#removeListener('accountsChanged', this.onAccountsChangedHandler)
		this.onChainChangedHandler && this.#removeListener('chainChanged', this.onChainChangedHandler)

		this.provider = undefined
		this.onDisconnectHandler = undefined
		this.onAccountsChangedHandler = undefined
		this.onChainChangedHandler = undefined
	}

	/**
	 * @note MetaMask disconnect event would be triggered when the specific chain changed (like L2 network),
	 * and will not be triggered when a user clicked disconnect in wallet...
	 */
	onDisconnect(handler: (error: ProviderRpcError) => void) {
		if (!this.provider) throw new ProviderNotFoundError()
		if (this.onDisconnectHandler) {
			this.#removeListener('disconnect', this.onDisconnectHandler)
		}
		this.onDisconnectHandler = handler
		this.provider.on('disconnect', handler)
	}

	onAccountsChanged(handler: (accounts: string[]) => void) {
		if (!this.provider) throw new ProviderNotFoundError()
		if (this.onAccountsChangedHandler) {
			this.#removeListener('accountsChanged', this.onAccountsChangedHandler)
		}
		this.onAccountsChangedHandler = handler
		this.provider.on('accountsChanged', handler)
	}

	onChainChanged(handler: (chainId: number) => void) {
		if (!this.provider) throw new ProviderNotFoundError()
		if (this.onChainChangedHandler) {
			this.#removeListener('chainChanged', this.onChainChangedHandler)
		}
		this.onChainChangedHandler = handler
		this.provider.on('chainChanged', (chainId: string) => {
			const _chainId = normalizeChainId(chainId)
			handler(_chainId)
		})
	}

	#removeListener(event: string, handler: (...args: any[]) => void) {
		if (!this.provider) throw new ProviderNotFoundError()
		this.provider.removeListener(event, handler)
	}

	/**
	 * docs: https://docs.metamask.io/wallet/reference/wallet_watchasset/
	 */
	async addERC20Token(options: AddERC20TokenOptions) {
		if (!this.provider) throw new ProviderNotFoundError()
		try {
			await this.provider.request({
				method: 'wallet_watchAsset',
				params: {
					// @ts-ignore
					type: 'ERC20',
					options: {
						address: options.address,
						symbol: options.symbol,
						decimals: options.decimals,
						image: options.image,
					},
				},
			})
		} catch (err: unknown) {
			throw new Error('Failed to add ERC20 token to MetaMask')
		}
	}

	/**
	 * docs: https://docs.metamask.io/wallet/reference/wallet_switchethereumchain/
	 */
	async switchChain(chainId: number, networkDetails: NetworkDetails) {
		if (!this.provider) throw new ProviderNotFoundError()
		const id = toHex(chainId)

		try {
			await this.provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: id }],
			})
		} catch (err: unknown) {
			if ((<ProviderRpcError>err).code === 4902) {
				try {
					await this.addChain(networkDetails)
				} catch (err: unknown) {
					if (this.#isUserRejectedRequestError(err)) {
						throw new UserRejectedRequestError(err)
					}
					throw new AddChainError()
				}
			}
			if (this.#isUserRejectedRequestError(err)) {
				throw new UserRejectedRequestError(err)
			}
			throw new SwitchChainError(err)
		}
	}

	async addChain(networkDetails: NetworkDetails) {
		if (!this.provider) throw new ProviderNotFoundError()
		try {
			this.provider.request({
				method: 'wallet_addEthereumChain',
				params: [networkDetails], // notice that chainId must be in hexadecimal numbers
			})
		} catch (err: unknown) {
			throw new AddChainError()
		}
	}

	#isUserRejectedRequestError(error: unknown) {
		return /(user rejected)/i.test((<Error>error).message)
	}
}