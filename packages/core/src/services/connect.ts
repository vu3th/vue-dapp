import { computed, readonly } from 'vue'
import {
	ConnectOptions,
	Connector,
	ConnectorName,
	OnAccountsChangedCallback,
	OnChainChangedCallback,
	OnDisconnectCallback,
	RDNS,
	Wallet,
} from '../types'
import { AutoConnectError, ConnectError, ConnectorNotFoundError } from '../errors'
import { normalizeChainId } from '../utils'
import { BrowserWalletConnector } from '../browserWalletConnector'

export function useConnect(store: {
	wallet: Wallet
	connectors: Connector[]
	onDisconnectCallback: OnDisconnectCallback | null
	onAccountsChangedCallback: OnAccountsChangedCallback | null
	onChainChangedCallback: OnChainChangedCallback | null
}) {
	const { wallet, connectors, onDisconnectCallback, onAccountsChangedCallback, onChainChangedCallback } = store

	async function resetWallet() {
		wallet.status = 'idle'
		wallet.error = null
		wallet.connectorName = null
		wallet.provider = null
		wallet.providerInfo = null
		wallet.connector = null
		wallet.address = null
		wallet.chainId = null
	}

	async function connectTo(connectorName: ConnectorName | string, options?: ConnectOptions) {
		wallet.error = ''
		wallet.status = 'connecting'

		// find connector
		const connector = connectors.find(conn => conn.name === connectorName)
		if (!connector) throw new ConnectorNotFoundError()

		try {
			const { provider, account, chainId, info } = await connector.connect(options)

			// console.log('useConnect.connectTo -> account', account)

			if (connector.name === 'BrowserWallet') {
				wallet.providerInfo = info!
			}

			wallet.connector = connector
			wallet.connectorName = connector.name as ConnectorName
			wallet.provider = provider
			wallet.address = account
			wallet.chainId = normalizeChainId(chainId)
		} catch (err: any) {
			await disconnect() // will resetWallet()
			wallet.error = err.message
			throw new ConnectError(err)
		}

		wallet.status = 'connected'
		localStorage.removeItem('VUE_DAPP__disconnected')

		// ============================= listen EIP-1193 events =============================
		// Events: disconnect, chainChanged, and accountsChanged

		wallet.connector.onDisconnect((...args: any[]) => {
			onDisconnectCallback && onDisconnectCallback(...args)

			// TODO:
			/**
			 * Exclude metamask to disconnect on this event
			 * @note MetaMask disconnect event would be triggered when the specific chain changed (like L2 network),
			 * so if we disconnect in this case, it would fail to reactivate ethers when chain changed
			 * because the wallet state was cleared.
			 * @todo better solution
			 */
			if (wallet.connectorName === 'BrowserWallet') {
				return
			}
			disconnect()
		})

		wallet.connector.onAccountsChanged(async (accounts: string[]) => {
			onAccountsChangedCallback && onAccountsChangedCallback(accounts)
			wallet.address = accounts[0]
		})

		wallet.connector.onChainChanged(async (chainId: number) => {
			onChainChangedCallback && onChainChangedCallback(normalizeChainId(chainId))
			wallet.chainId = normalizeChainId(chainId)
		})
	}

	async function disconnect() {
		// console.log('useConnect.disconnect')
		if (wallet.connector) {
			try {
				await wallet.connector.disconnect()
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

		const browserWalletConn = connectors.find(conn => conn.name === 'BrowserWallet')

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
		// wallet: wallet,

		// status: computed(() => wallet.status),
		// error: computed(() => wallet.error),
		// connectorName: computed(() => wallet.connectorName),
		// provider: computed(() => wallet.provider),
		// providerInfo: computed(() => wallet.providerInfo),
		// connector: computed(() => wallet.connector),
		// address: computed(() => wallet.address),
		// chainId: computed(() => wallet.chainId),

		// isConnected: computed(() => wallet.status === 'connected'),

		resetWallet,
		connectTo,
		disconnect,
		autoConnect,
	}
}
