import { computed, reactive, readonly, ref, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { Connector, EIP6963ProviderDetail, OnDisconnectCallback } from './types'
import { Wallet, OnAccountsChangedCallback, OnChainChangedCallback } from './types'

import { useEIP6963 } from './services/eip6963'
import { useConnectors } from './services/connectors'
import { useListeners } from './services/listeners'
import { useConnect } from './services/connect'

/**
 * Pinia Setup Store
 *  - Setup Stores https://pinia.vuejs.org/core-concepts/#Setup-Stores
 *  - dealing with SSR https://pinia.vuejs.org/cookbook/composables.html#SSR
 */
export const useVueDapp = defineStore('vd-store', () => {
	// ============================= service: connectors =============================

	const connectors: Connector[] = reactive([])

	// ============================= service: EIP6963 =============================
	const providerDetails = reactive<EIP6963ProviderDetail[]>([])

	// ============================= service: wallet =============================
	const wallet = reactive<Wallet>({
		status: 'idle',
		error: null,
		connectorName: null,
		provider: null,
		providerInfo: null,
		connector: null,
		address: null,
		chainId: null,
	})

	const onDisconnectCallback = ref<OnDisconnectCallback | null>(null)
	const onAccountsChangedCallback = ref<OnAccountsChangedCallback | null>(null)
	const onChainChangedCallback = ref<OnChainChangedCallback | null>(null)

	const isConnected = computed(() => wallet.status === 'connected')

	return {
		onDisconnectCallback,
		onAccountsChangedCallback,
		onChainChangedCallback,

		...useConnect({
			wallet,
			connectors,
			onDisconnectCallback: onDisconnectCallback.value,
			onAccountsChangedCallback: onAccountsChangedCallback.value,
			onChainChangedCallback: onChainChangedCallback.value,
		}),
		...useConnectors({
			wallet,
			connectors,
			onDisconnectCallback: onDisconnectCallback.value,
			onAccountsChangedCallback: onAccountsChangedCallback.value,
			onChainChangedCallback: onChainChangedCallback.value,
		}),
		...useEIP6963({
			wallet,
			providerDetails,
		}),
		...useListeners({
			wallet,
			connectors,
		}),

		wallet: wallet,

		status: computed(() => wallet.status),
		error: computed(() => wallet.error),
		connectorName: computed(() => wallet.connectorName),
		provider: computed(() => wallet.provider),
		providerInfo: computed(() => wallet.providerInfo),
		connector: computed(() => wallet.connector),
		address: computed(() => wallet.address),
		chainId: computed(() => wallet.chainId),

		isConnected,
	}
})
