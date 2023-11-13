import { computed, markRaw, reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { Connector } from './types'
import { ConnectorNotFoundError, ConnectError } from './errors'
import { WalletProvider } from './types'
import invariant from 'tiny-invariant'
import { normalizeChainId } from './utils'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected'

export type WalletState = {
	provider: WalletProvider
	address: string
	chainId: number
}

export type OnActivatedHook = (context: WalletState) => void
export type OnChangedHook = (context: WalletState) => void
export type OnDeactivatedHook = () => void

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

	// wallet state
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
			updateWalletState({
				address: accounts[0],
			})
		})

		connector.value.onChainChanged(async (_chainId: number) => {
			onChainChangedCallback.value && onChainChangedCallback.value(normalizeChainId(_chainId))
			updateWalletState({
				chainId: normalizeChainId(_chainId),
			})
		})

		function updateWalletState(data: {
			provider?: WalletState['provider']
			address?: WalletState['address']
			chainId?: WalletState['chainId']
		}) {
			if (data.provider) {
				provider.value = data.provider
			}

			if (data.address) {
				address.value = data.address
			}

			if (data.chainId) {
				chainId.value = data.chainId
			}
		}
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

	const onActivatedHook = ref<OnActivatedHook | null>(null)
	const onDeactivatedHook = ref<OnDeactivatedHook | null>(null)
	const onChangedHook = ref<OnChangedHook | null>(null)

	watch(isConnected, (val, oldVal) => {
		if (val && !oldVal) {
			invariant(provider.value, 'VueDappError: useWalletStore-watch-isConnected-provider')
			invariant(address.value, 'VueDappError: useWalletStore-watch-isConnected-address')
			invariant(chainId.value, 'VueDappError: useWalletStore-watch-isConnected-chainId')

			onActivatedHook.value &&
				onActivatedHook.value({
					provider: provider.value,
					address: address.value,
					chainId: chainId.value,
				})
		}
	})

	watch(provider, (val, oldVal) => {
		if (oldVal && val) {
			onChangedHook.value &&
				onChangedHook.value({
					provider: val,
					address: address.value,
					chainId: chainId.value,
				})
		} else if (oldVal && !val) {
			onDeactivatedHook.value && onDeactivatedHook.value()
		}
	})

	watch(chainId, () => {
		invariant(provider.value, 'VueDappError: useWalletStore-watch-chainId-provider')
		invariant(address.value, 'VueDappError: useWalletStore-watch-chainId-address')
		invariant(chainId.value, 'VueDappError: useWalletStore-watch-chainId-chainId')

		onChangedHook.value &&
			onChangedHook.value({
				provider: provider.value,
				address: address.value,
				chainId: chainId.value,
			})
	})

	const onActivated = (hook: OnActivatedHook) => (onActivatedHook.value = hook)
	const onChanged = (hook: OnChangedHook) => (onChangedHook.value = hook)
	const onDeactivated = (hook: OnDeactivatedHook) => (onDeactivatedHook.value = hook)

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

		// hooks
		onActivated,
		onDeactivated,
		onChanged,
	}
})
