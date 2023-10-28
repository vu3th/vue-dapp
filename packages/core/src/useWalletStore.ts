import { computed, markRaw, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { Connector, ConnectorNotFoundError, ConnectError } from './connectors'
import { WalletProvider } from './types'
import invariant from 'tiny-invariant'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected'

export type HookContext = {
	provider: WalletProvider
	address: string
}

export type OnActivatedHook = (context: HookContext) => void
export type OnChangedHook = (context: HookContext) => void
export type OnDeactivatedHook = () => void

/**
 * Pinia Setup Store
 *  - Setup Stores https://pinia.vuejs.org/core-concepts/#Setup-Stores
 *  - dealing with SSR https://pinia.vuejs.org/cookbook/composables.html#SSR
 */
export const useWalletStore = defineStore('vd-wallet', () => {
	const connector = ref<Connector | null>(null)
	const provider = ref<WalletProvider | null>(null)
	const status = ref<ConnectionStatus>('idle')
	const address = ref('')
	const error = ref('')

	const isConnected = computed(() => status.value === 'connected')

	async function connectWith(_connector: Connector, timeout?: number) {
		error.value = ''
		status.value = 'connecting'

		try {
			if (!_connector) throw new ConnectorNotFoundError()

			const { provider: _provider, account } = await _connector.connect(timeout)

			connector.value = markRaw(_connector)
			provider.value = markRaw(_provider)
			address.value = account
		} catch (err: any) {
			await disconnect() // will also resetWallet()
			error.value = err.message
			throw new ConnectError(err)
		}

		status.value = 'connected'
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
			invariant(address.value, 'VueDappError: useWalletStore-watch-isConnected-address')
			invariant(provider.value, 'VueDappError: useWalletStore-watch-isConnected-provider')

			onActivatedHook.value &&
				onActivatedHook.value({
					provider: provider.value,
					address: address.value,
				})
		}
	})

	watch(provider, (val, oldVal) => {
		if (oldVal && val) {
			onChangedHook.value &&
				onChangedHook.value({
					provider: val,
					address: address.value,
				})
		} else if (oldVal && !val) {
			onDeactivatedHook.value && onDeactivatedHook.value()
		}
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
