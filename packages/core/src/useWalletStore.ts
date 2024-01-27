import { computed, reactive, ref, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { ConnectOptions, Connector, ConnectorName, EIP6963ProviderDetail, EIP6963ProviderInfo } from './types'
import { ConnectorNotFoundError, ConnectError, AutoConnectError } from './errors'
import { EIP1193Provider } from './types'
import { normalizeChainId } from './utils'
import { BrowserWalletConnector } from './browserWalletConnector'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected'

// feat: callbacks
export type OnDisconnectCallback = (...args: any[]) => void
export type OnAccountsChangedCallback = (accounts: string[]) => void
export type OnChainChangedCallback = (chainId: number) => void

/**
 * Pinia Setup Store
 *  - Setup Stores https://pinia.vuejs.org/core-concepts/#Setup-Stores
 *  - dealing with SSR https://pinia.vuejs.org/cookbook/composables.html#SSR
 */
export const useWalletStore = defineStore('vd-wallet', () => {
	// ============================= feat: connectors =============================

	const connectors: Connector[] = reactive([])

	// ============================= feat: EIP6963 =============================
	const providerDetails = reactive<EIP6963ProviderDetail[]>([])

	// ============================= dev: dumb =============================

	const dumb = ref(true)
	function setDumb(isDumb: boolean) {
		dumb.value = isDumb
	}

	// ============================= feat: wallet =============================

	const walletState = reactive<{
		status: ConnectionStatus
		error: string | null

		name: ConnectorName | null
		provider: EIP1193Provider | null
		providerInfo: EIP6963ProviderInfo | null
		connector: Connector | null
		address: string | null
		chainId: number | null
	}>({
		status: 'idle',
		error: null,

		name: null,
		provider: null,
		providerInfo: null,
		connector: null,
		address: null,
		chainId: null,
	})

	async function resetWallet() {
		walletState.status = 'idle'
		walletState.error = null
		walletState.name = null
		walletState.provider = null
		walletState.providerInfo = null
		walletState.connector = null
		walletState.address = null
		walletState.chainId = null
	}

	const isConnected = computed(() => walletState.status === 'connected')

	// feat: callbacks
	const onDisconnectCallback = ref<OnDisconnectCallback | null>(null)
	const onAccountsChangedCallback = ref<OnAccountsChangedCallback | null>(null)
	const onChainChangedCallback = ref<OnChainChangedCallback | null>(null)

	async function connectTo(connectorName: ConnectorName | string, options?: ConnectOptions) {
		walletState.error = ''
		walletState.status = 'connecting'

		// find connector
		const connector = connectors.find(conn => conn.name === connectorName)
		if (!connector) throw new ConnectorNotFoundError()

		try {
			const { provider, account, chainId, info } = await connector.connect(options)

			// console.log('useWalletStore.connectTo -> account', account)

			if (connector.name === 'BrowserWallet') {
				walletState.providerInfo = info!
			}

			walletState.connector = connector
			walletState.name = connector.name as ConnectorName
			walletState.provider = provider
			walletState.address = account
			walletState.chainId = normalizeChainId(chainId)
		} catch (err: any) {
			await disconnect() // will resetWallet()
			walletState.error = err.message
			throw new ConnectError(err)
		}

		walletState.status = 'connected'
		localStorage.removeItem('VUE_DAPP__hasDisconnected')

		// feat: callbacks
		walletState.connector.onDisconnect((...args: any[]) => {
			onDisconnectCallback.value && onDisconnectCallback.value(...args)

			/**
			 * Exclude metamask to disconnect on this event
			 * @note MetaMask disconnect event would be triggered when the specific chain changed (like L2 network),
			 * so if we disconnect in this case, it would fail to reactivate ethers when chain changed
			 * because the wallet state was cleared.
			 * @todo better solution
			 */
			if (walletState.name === 'BrowserWallet') {
				return
			}
			disconnect()
		})

		walletState.connector.onAccountsChanged(async (accounts: string[]) => {
			onAccountsChangedCallback.value && onAccountsChangedCallback.value(accounts)
			walletState.address = accounts[0]
		})

		walletState.connector.onChainChanged(async (chainId: number) => {
			onChainChangedCallback.value && onChainChangedCallback.value(normalizeChainId(chainId))
			walletState.chainId = normalizeChainId(chainId)
		})
	}

	async function disconnect() {
		// console.log('isProxy', isProxy(walletState.connector))
		// console.log('useWalletStore.disconnect')
		if (walletState.connector) {
			try {
				await walletState.connector.disconnect()
			} catch (err: any) {
				resetWallet()
				throw new Error(err)
			}
		}
		resetWallet()

		localStorage.setItem('VUE_DAPP__hasDisconnected', 'true')
	}

	async function autoConnect() {
		if (localStorage.getItem('VUE_DAPP__hasDisconnected')) {
			!dumb.value && console.warn('No auto-connect: has disconnected') // eslint-disable-line
			return
		}

		const browserWalletConn = connectors.find(conn => conn.name === 'BrowserWallet')

		if (browserWalletConn) {
			try {
				const isConnected = await BrowserWalletConnector.checkConnection()
				if (isConnected) {
					await connectTo(browserWalletConn.name)
				} else if (!dumb.value) {
					console.warn('No auto-connect to MetaMask: not connected')
				}
			} catch (err: any) {
				throw new AutoConnectError(err)
			}
		} else if (!dumb.value) {
			console.warn('No auto-connect to MetaMask: connector not found')
		}
	}

	return {
		// composables: connectors
		connectors: connectors,

		// composables: eip6963
		providerDetails,

		// state
		walletState,
		...toRefs(walletState),

		// computed
		isConnected,

		// wallet functions
		connectTo,
		disconnect,
		resetWallet,
		autoConnect,

		// callbacks (for listener)
		onDisconnectCallback,
		onAccountsChangedCallback,
		onChainChangedCallback,

		// others
		setDumb,
	}
})
