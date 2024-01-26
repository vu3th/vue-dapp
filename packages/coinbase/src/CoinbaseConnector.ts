import {
	Connector,
	toHex,
	ProviderNotFoundError,
	ProviderRpcError,
	SwitchChainError,
	UserRejectedRequestError,
	AddChainError,
} from '@vue-dapp/core'
import type { CoinbaseWalletProvider } from '@coinbase/wallet-sdk'
import type { CoinbaseWalletSDKOptions } from '@coinbase/wallet-sdk/dist/CoinbaseWalletSDK'

/**
 * Coinbase Wallet SDK
 * Docs: https://docs.cloud.coinbase.com/wallet-sdk/docs/
 */
export interface ICoinbaseWalletProvider extends CoinbaseWalletProvider {} // eslint-disable-line

export type CoinbaseWalletConnectorOptions = CoinbaseWalletSDKOptions & {
	jsonRpcUrl: string
	chainId?: number
}

export class CoinbaseWalletConnector extends Connector<CoinbaseWalletProvider, CoinbaseWalletConnectorOptions> {
	readonly name = 'CoinbaseWallet'

	#provider?: CoinbaseWalletProvider
	#onDisconnectHandler?: () => void
	#onAccountsChangedHandler?: (accounts: string[]) => void
	#onChainChangedHandler?: (chainId: number) => void

	constructor(options: CoinbaseWalletConnectorOptions) {
		super(options)
	}

	async connect() {
		const provider = await this.getProvider()
		this.#provider = provider
		const chainId = (await this.#provider.request({ method: 'eth_chainId' })) as number
		const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[]
		const account = accounts[0]

		return {
			account,
			provider,
			chainId,
		}
	}

	async getProvider() {
		let CoinbaseWalletSDK = (await import('@coinbase/wallet-sdk')).default
		// Workaround for Vite dev import errors https://github.com/vitejs/vite/issues/7112
		// refer to wagmi, thanks! https://github.com/wagmi-dev/references/blob/44b0c4c91147c2aae9689560ddc5f9acbecdfa29/packages/connectors/src/coinbaseWallet.ts#L122-L133
		if (
			typeof CoinbaseWalletSDK !== 'function' &&
			// @ts-expect-error This import error is not visible to TypeScript
			typeof CoinbaseWalletSDK.default === 'function'
		)
			CoinbaseWalletSDK = (CoinbaseWalletSDK as unknown as { default: typeof CoinbaseWalletSDK }).default

		const client = new CoinbaseWalletSDK(this.options)
		const provider = client.makeWeb3Provider(this.options.jsonRpcUrl, this.options.chainId)
		return provider
	}

	async disconnect() {
		if (!this.#provider) throw new ProviderNotFoundError()
		await this.#provider.close()
		this.#provider = undefined
	}

	/**
	 * @note CoinbaseWallet will reload page if it disconnected by wallet app.
	 * @todo experiment with the browser extension
	 */
	onDisconnect(handler: () => void) {
		if (!this.#provider) throw new ProviderNotFoundError()
		if (this.#onDisconnectHandler) {
			this.#removeListener('disconnect', this.#onDisconnectHandler)
		}
		this.#onDisconnectHandler = handler
		this.#provider.on('disconnect', handler)
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
		this.#provider.on('chainChanged', handler)
	}

	#removeListener(event: string, handler: (...args: any[]) => void) {
		if (!this.#provider) throw new ProviderNotFoundError()
		this.#provider.removeListener(event, handler)
		// console.log('remove listener', event, handler)
	}

	/**
	 * @todo: add addChain()
	 */
	async switchChain(chainId: number) {
		if (!this.#provider) throw new ProviderNotFoundError()
		const provider = this.#provider
		const id = toHex(chainId)

		try {
			await provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: id }],
			})
		} catch (error: unknown) {
			if ((<ProviderRpcError>error).code === 4902) {
				try {
					// await provider.request({
					//   method: 'wallet_addEthereumChain',
					//   params: [
					//     {
					//       chainId: id,
					//       chainName: chain.name,
					//       nativeCurrency: chain.nativeCurrency,
					//       rpcUrls: [chain.rpcUrls.default],
					//       blockExplorerUrls: this.getBlockExplorerUrls(chain),
					//     },
					//   ],
					// })
				} catch (addError: unknown) {
					if (this.#isUserRejectedRequestError(addError)) {
						throw new UserRejectedRequestError(addError)
					}
					throw new AddChainError()
				}
			}

			if (this.#isUserRejectedRequestError(error)) {
				throw new UserRejectedRequestError(error)
			}
			throw new SwitchChainError(error)
		}
	}

	#isUserRejectedRequestError(error: unknown) {
		return /(user rejected)/i.test((<Error>error).message)
	}
}
