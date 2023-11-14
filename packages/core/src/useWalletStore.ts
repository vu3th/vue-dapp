import { computed, markRaw, ref, toRaw, watch } from 'vue'
import { defineStore } from 'pinia'
import { Connector } from './types'
import { ConnectorNotFoundError, ConnectError } from './errors'
import { WalletProvider } from './types'
import invariant from 'tiny-invariant'
import { normalizeChainId } from './utils'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected'

export type HookContext = {
	provider: WalletProvider
	address: string
	chainId: number
}

export type OnConnectedHook = (context: HookContext) => void
export type OnChangedHook = (context: HookContext) => void
export type OnDisconnectHook = () => void

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
	const status = ref<ConnectionStatus>('idle')
	const error = ref('')

	const connector = ref<Connector | null>(null)
	const provider = ref<WalletProvider | null>(null)
	const address = ref('')
	const chainId = ref(-1)

	// feat: callbacks
	const onDisconnectCallback = ref<OnDisconnectCallback | null>(null)
	const onAccountsChangedCallback = ref<OnAccountsChangedCallback | null>(null)
	const onChainChangedCallback = ref<OnChainChangedCallback | null>(null)

	const isConnected = computed(() => status.value === 'connected')

	async function connectWith(_connector: Connector, timeout?: number) {
		error.value = ''
		status.value = 'connecting'

		try {
			if (!_connector) throw new ConnectorNotFoundError()

			const { provider: _provider, account, chainId: _chainId } = await _connector.connect(timeout)

			connector.value = markRaw(_connector)
			provider.value = markRaw(_provider)
			address.value = account
			chainId.value = normalizeChainId(_chainId)
		} catch (err: any) {
			await disconnect() // will also resetWallet()
			error.value = err.message
			throw new ConnectError(err)
		}

		status.value = 'connected'

		// feat: callbacks
		connector.value.onDisconnect((...args: any[]) => {
			onDisconnectCallback.value && onDisconnectCallback.value(...args)
			/**
			 * Exclude metamask to disconnect on this event
			 * @note MetaMask disconnect event would be triggered when the specific chain changed (like L2 network),
			 * so if we disconnect in this case, it would fail to reactivate ethers when chain changed
			 * because the wallet state was cleared.
			 * @todo better solution
			 */
			if (connector.value?.name === 'metaMask') {
				return
			}
			disconnect()
		})

		connector.value.onAccountsChanged(async (accounts: string[]) => {
			onAccountsChangedCallback.value && onAccountsChangedCallback.value(accounts)
			address.value = accounts[0]
		})

		connector.value.onChainChanged(async (_chainId: number) => {
			onChainChangedCallback.value && onChainChangedCallback.value(normalizeChainId(_chainId))
			chainId.value = normalizeChainId(_chainId)
		})
	}

	async function disconnect() {
		if (connector.value) {
			try {
				await connector.value.disconnect()
			} catch (err: any) {
				resetWallet()
				throw new Error(err)
			}
		}
		resetWallet()
		// @todo
		// persistDisconnect.value && localStorage.setItem('VUE_DAPP__hasDisconnected', 'true')
	}

	async function resetWallet() {
		connector.value = null
		provider.value = null
		status.value = 'idle'
		address.value = ''
	}

	// @todo
	function autoConnect(connectors: Connector[]) {
		console.log('autoConnect')
	}

	// ========================= hooks =========================

	const onConnectedHook = ref<OnConnectedHook | null>(null)
	const onDisconnectHook = ref<OnDisconnectHook | null>(null)
	const onChangedHook = ref<OnChangedHook | null>(null)

	watch(isConnected, (val, oldVal) => {
		if (val && !oldVal) {
			invariant(provider.value, 'VueDappError: useWalletStore-watch-isConnected-provider')
			invariant(address.value, 'VueDappError: useWalletStore-watch-isConnected-address')
			invariant(chainId.value, 'VueDappError: useWalletStore-watch-isConnected-chainId')

			onConnectedHook.value &&
				onConnectedHook.value({
					provider: toRaw(provider.value),
					address: toRaw(address.value),
					chainId: toRaw(chainId.value),
				})
		} else {
			onDisconnectHook.value && onDisconnectHook.value()
		}
	})

	watch(address, (val, oldVal) => {
		if (oldVal && val) {
			invariant(provider.value, 'VueDappError: useWalletStore-watch-address-provider')
			invariant(address.value, 'VueDappError: useWalletStore-watch-address-address')
			invariant(chainId.value, 'VueDappError: useWalletStore-watch-address-chainId')

			onChangedHook.value &&
				onChangedHook.value({
					provider: toRaw(provider.value),
					address: toRaw(address.value),
					chainId: toRaw(chainId.value),
				})
		}
	})

	watch(chainId, (val, oldVal) => {
		if (val && oldVal > 0) {
			invariant(provider.value, 'VueDappError: useWalletStore-watch-chainId-provider')
			invariant(address.value, 'VueDappError: useWalletStore-watch-chainId-address')
			invariant(chainId.value, 'VueDappError: useWalletStore-watch-chainId-chainId')

			onChangedHook.value &&
				onChangedHook.value({
					provider: toRaw(provider.value),
					address: toRaw(address.value),
					chainId: toRaw(chainId.value),
				})
		}
	})

	const onActivated = (hook: OnConnectedHook) => (onConnectedHook.value = hook)
	const onChanged = (hook: OnChangedHook) => (onChangedHook.value = hook)
	const onDeactivated = (hook: OnDisconnectHook) => (onDisconnectHook.value = hook)

	return {
		// state
		provider,
		connector,
		status,
		address,
		error,
		isConnected,

		// wallet functions
		connectWith,
		disconnect,
		resetWallet,
		autoConnect,

		// hooks (for watcher)
		onActivated,
		onDeactivated,
		onChanged,

		// callbacks (for listener)
		onDisconnectCallback,
		onAccountsChangedCallback,
		onChainChangedCallback,
	}
})
