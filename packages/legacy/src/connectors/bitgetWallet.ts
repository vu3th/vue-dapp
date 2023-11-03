import { Connector } from './connector'
import type { EIP1193Provider, EIP1193Options } from '@bitget-wallet/web3-sdk'

import { getAddress, hexValue } from 'ethers/lib/utils'
import {
	AddChainError,
	ProviderNotFoundError,
	ProviderRpcError,
	SwitchChainError,
	UserRejectedRequestError,
} from './errors'

type BitgetWalletConnectorOptions = EIP1193Options & {
	/**
	 * Connector automatically connects when used as Safe App.
	 *
	 * This flag simulates the disconnect behavior by keeping track of connection status in storage
	 * and only autoconnecting when previously connected by user action (e.g. explicitly choosing to connect).
	 *
	 * @default false
	 */
	shimDisconnect?: boolean
}

export class BitgetWalletConnector extends Connector<EIP1193Provider, BitgetWalletConnectorOptions> {
	readonly name = 'bitgetWallet'

	#provider?: EIP1193Provider
	#onDisconnectHandler?: () => void
	#onAccountsChangedHandler?: (accounts: string[]) => void
	#onChainChangedHandler?: (chainId: number) => void

	constructor(options: BitgetWalletConnectorOptions = {}) {
		super(options)
	}

	async connect() {
		const provider = await this.getProvider()
		this.#provider = provider
		const accounts = await provider.enable()
		const account = getAddress(accounts[0])
		return {
			account,
			provider,
		}
	}

	async getProvider() {
		const { EIP1193Adapter, getIsInstall, getDownload, installWalletMessage } = await import(
			'@bitget-wallet/web3-sdk'
		)
		const adapter = new EIP1193Adapter()
		if (getIsInstall()) {
			const provider = adapter.getProvider()
			return provider
		} else {
			window.open(getDownload(), '_blank')
			throw new Error(installWalletMessage)
		}
	}

	async disconnect() {
		if (!this.#provider) throw new ProviderNotFoundError()
		await this.#provider.close()
		this.#provider = undefined
	}

	/**
	 * @note BitgetWallet will reload page if it disconnected by wallet app.
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

	async switchChain(chainId: number) {
		if (!this.#provider) throw new ProviderNotFoundError()
		const provider = this.#provider
		const id = hexValue(chainId)

		try {
			await provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: id }],
			})
		} catch (error: unknown) {
			if ((<ProviderRpcError>error).code === 4902) {
				try {
					// Before switching a network that is not added, add the network first
					await provider.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: id,
							},
						],
					})
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
