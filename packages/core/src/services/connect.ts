import { computed, provide, readonly } from 'vue'
import { useStore } from '../store'
import { ConnectOptions, ConnectorName, ProviderTarget } from '../types'
import { AutoConnectError, ConnectError, ConnectorNotFoundError } from '../errors'
import { normalizeChainId } from '../utils'
import {
	getLastConnectedBrowserWallet,
	removeLastConnectedBrowserWallet,
	setLastConnectedBrowserWallet,
} from './localStorage'

export function useConnect(pinia?: any) {
	const walletStore = useStore(pinia)

	async function resetWallet() {
		walletStore.wallet.status = 'idle'
		walletStore.wallet.error = null
		walletStore.wallet.connectorName = null
		walletStore.wallet.provider = null
		walletStore.wallet.connector = null
		walletStore.wallet.address = null
		walletStore.wallet.chainId = null
		walletStore.wallet.providerInfo = null
		walletStore.wallet.providerTarget = null
	}

	async function connectTo<T extends ConnectorName>(connectorName: T, options: ConnectOptions<T>) {
		walletStore.wallet.error = ''
		walletStore.wallet.status = 'connecting'

		// find connector
		const connector = walletStore.connectors.find(conn => conn.name === connectorName)
		if (!connector) throw new ConnectorNotFoundError()

		try {
			const { provider, account, chainId, info } = await connector.connect(options)

			if (connector.name === 'BrowserWallet') {
				walletStore.wallet.providerInfo = info || null
				walletStore.wallet.providerTarget = options?.target || null
			}

			walletStore.wallet.connector = connector
			walletStore.wallet.connectorName = connector.name as ConnectorName
			walletStore.wallet.provider = provider
			walletStore.wallet.address = account
			walletStore.wallet.chainId = normalizeChainId(chainId)

			walletStore.wallet.status = 'connected'
			if (info?.rdns) setLastConnectedBrowserWallet(info.rdns)
		} catch (err: any) {
			await disconnect() // will resetWallet()
			walletStore.wallet.error = err.message
			throw new ConnectError(err)
		}

		// ============================= listen EIP-1193 events =============================
		// Events: disconnect, chainChanged, and accountsChanged

		walletStore.wallet.connector.onDisconnect((...args: any[]) => {
			walletStore.onDisconnectCallback && walletStore.onDisconnectCallback(...args)

			// TODO:
			/**
			 * Exclude metamask to disconnect on this event
			 * @note MetaMask disconnect event would be triggered when the specific chain changed (like L2 network),
			 * so if we disconnect in this case, it would fail to reactivate ethers when chain changed
			 * because the wallet state was cleared.
			 * @todo better solution
			 */
			if (walletStore.wallet.connectorName === 'BrowserWallet') {
				return
			}
			disconnect()
		})

		walletStore.wallet.connector.onAccountsChanged(async (accounts: string[]) => {
			walletStore.onAccountsChangedCallback && walletStore.onAccountsChangedCallback(accounts)

			if (!accounts.length) {
				disconnect()
				return
			}

			walletStore.wallet.address = accounts[0]
		})

		walletStore.wallet.connector.onChainChanged(async (chainId: number) => {
			walletStore.onChainChangedCallback && walletStore.onChainChangedCallback(normalizeChainId(chainId))
			walletStore.wallet.chainId = normalizeChainId(chainId)
		})
	}

	async function disconnect() {
		try {
			if (walletStore.wallet.connector) {
				await walletStore.wallet.connector.disconnect()
			}
		} catch (err: any) {
			walletStore.error = `Failed to disconnect, wallet reset: ${err.message}`
			throw new Error(`Failed to disconnect, wallet reset: ${err.message}`)
		} finally {
			resetWallet()
			removeLastConnectedBrowserWallet()
		}
	}

	const isWindowEthereumAvailable = typeof window !== 'undefined' && !!window.ethereum

	async function autoConnect(target: ProviderTarget) {
		const browserWallet = walletStore.connectors.find(conn => conn.name === 'BrowserWallet')
		if (!browserWallet) return

		let options: ConnectOptions<'BrowserWallet'>

		switch (target) {
			case 'window.ethereum':
				if (!isWindowEthereumAvailable) return
				options = {
					target: 'window.ethereum',
				}
				break
			case 'rdns':
				const lastRdns = getLastConnectedBrowserWallet()
				if (!lastRdns) return

				options = { target: 'rdns', rdns: lastRdns }
				break
			default:
				throw new Error('target is required')
		}

		try {
			await connectTo('BrowserWallet', options)
		} catch (err: any) {
			throw new AutoConnectError(err)
		}
	}

	function onDisconnect(callback: (...args: any[]) => void) {
		walletStore.onDisconnectCallback = callback
	}

	function onAccountsChanged(callback: (accounts: string[]) => void) {
		walletStore.onAccountsChangedCallback = callback
	}

	function onChainChanged(callback: (chainId: number) => void) {
		walletStore.onChainChangedCallback = callback
	}

	return {
		isWindowEthereumAvailable,

		wallet: readonly(walletStore.wallet),

		status: computed(() => walletStore.wallet.status),
		error: computed(() => walletStore.wallet.error),
		connectorName: computed(() => walletStore.wallet.connectorName),
		provider: computed(() => walletStore.wallet.provider),
		connector: computed(() => walletStore.wallet.connector),
		address: computed(() => walletStore.wallet.address),
		chainId: computed(() => walletStore.wallet.chainId),
		providerInfo: computed(() => walletStore.wallet.providerInfo),
		providerTarget: computed(() => walletStore.wallet.providerTarget),

		isConnected: computed(() => walletStore.wallet.status === 'connected'),

		resetWallet,
		connectTo,
		disconnect,
		autoConnect,

		onDisconnect,
		onAccountsChanged,
		onChainChanged,
	}
}
