import { computed } from 'vue'
import { useStore } from '../store'
import { ConnectOptions, ConnectorName, RDNS } from '../types'
import { AutoConnectError, ConnectError, ConnectorNotFoundError } from '../errors'
import { normalizeChainId } from '../utils'
import { BrowserWalletConnector } from '../browserWalletConnector'

export function useConnect(pinia?: any) {
	const walletStore = useStore(pinia)

	async function resetWallet() {
		walletStore.wallet.status = 'idle'
		walletStore.wallet.error = null
		walletStore.wallet.connectorName = null
		walletStore.wallet.provider = null
		walletStore.wallet.providerInfo = null
		walletStore.wallet.connector = null
		walletStore.wallet.address = null
		walletStore.wallet.chainId = null
	}

	async function connectTo(connectorName: ConnectorName | string, options?: ConnectOptions) {
		walletStore.wallet.error = ''
		walletStore.wallet.status = 'connecting'

		// find connector
		const connector = walletStore.connectors.find(conn => conn.name === connectorName)
		if (!connector) throw new ConnectorNotFoundError()

		try {
			const { provider, account, chainId, info } = await connector.connect(options)

			// console.log('useConnect.connectTo -> account', account)

			if (connector.name === 'BrowserWallet') {
				walletStore.wallet.providerInfo = info!
			}

			walletStore.wallet.connector = connector
			walletStore.wallet.connectorName = connector.name as ConnectorName
			walletStore.wallet.provider = provider
			walletStore.wallet.address = account
			walletStore.wallet.chainId = normalizeChainId(chainId)
		} catch (err: any) {
			await disconnect() // will resetWallet()
			walletStore.wallet.error = err.message
			throw new ConnectError(err)
		}

		walletStore.wallet.status = 'connected'
		localStorage.removeItem('VUE_DAPP__disconnected')

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
			walletStore.wallet.address = accounts[0]
		})

		walletStore.wallet.connector.onChainChanged(async (chainId: number) => {
			walletStore.onChainChangedCallback && walletStore.onChainChangedCallback(normalizeChainId(chainId))
			walletStore.wallet.chainId = normalizeChainId(chainId)
		})
	}

	async function disconnect() {
		// console.log('useConnect.disconnect')
		if (walletStore.wallet.connector) {
			try {
				await walletStore.wallet.connector.disconnect()
			} catch (err: any) {
				resetWallet()
				throw new Error(err)
			}
		}
		resetWallet()

		localStorage.setItem('VUE_DAPP__disconnected', 'true')
	}

	async function autoConnect(rdns: RDNS | string) {
		if (localStorage.getItem('VUE_DAPP__disconnected')) {
			// console.warn('No auto-connect: has disconnected')
			return
		}

		const browserWalletConn = walletStore.connectors.find(conn => conn.name === 'BrowserWallet')

		if (browserWalletConn) {
			try {
				const isConnected = await BrowserWalletConnector.checkConnection(rdns)
				if (isConnected) {
					await connectTo(browserWalletConn.name, {
						rdns,
					})
				} else {
					// console.warn('No auto-connect to MetaMask: not connected')
				}
			} catch (err: any) {
				throw new AutoConnectError(err)
			}
		} else {
			// console.warn('No auto-connect to MetaMask: connector not found')
		}
	}

	return {
		wallet: computed(() => walletStore.wallet),

		status: computed(() => walletStore.wallet.status),
		error: computed(() => walletStore.wallet.error),
		connectorName: computed(() => walletStore.wallet.connectorName),
		provider: computed(() => walletStore.wallet.provider),
		providerInfo: computed(() => walletStore.wallet.providerInfo),
		connector: computed(() => walletStore.wallet.connector),
		address: computed(() => walletStore.wallet.address),
		chainId: computed(() => walletStore.wallet.chainId),

		isConnected: computed(() => walletStore.wallet.status === 'connected'),

		resetWallet,
		connectTo,
		disconnect,
		autoConnect,
	}
}
