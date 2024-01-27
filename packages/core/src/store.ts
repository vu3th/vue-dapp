import { reactive, ref, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { Connector, EIP6963ProviderDetail, OnDisconnectCallback } from './types'
import { Wallet, OnAccountsChangedCallback, OnChainChangedCallback } from './types'

/**
 * Pinia Setup Store
 *  - Setup Stores https://pinia.vuejs.org/core-concepts/#Setup-Stores
 *  - dealing with SSR https://pinia.vuejs.org/cookbook/composables.html#SSR
 */
export const useStore = defineStore('vd-store', () => {
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

	return {
		// service: connectors
		connectors,

		// service: eip6963
		providerDetails,

		// service: wallet
		wallet,
		...toRefs(wallet),
		onDisconnectCallback,
		onAccountsChangedCallback,
		onChainChangedCallback,
	}
})
