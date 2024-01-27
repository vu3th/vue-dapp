import { computed, watch, toRaw } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from './useWalletStore'
import { EIP1193Provider } from './types'
import invariant from 'tiny-invariant'
import { useEIP6963 } from './composables/eip6963'
import { useConnectors } from './composables/connectors'

export type WalletContext = {
	// export walletState?
	provider: EIP1193Provider
	address: string
	chainId: number
}

export type OnConnectedCB = (context: WalletContext) => void
export type OnAccountOrChainIdChangedCB = (context: WalletContext) => void
export type OnDisconnectedCB = () => void
export type OnWalletUpdatedCB = (context: WalletContext) => void

export function useVueDapp(pinia?: any) {
	const walletStore = useWalletStore(pinia)

	const {
		connectTo,
		disconnect,
		resetWallet,
		autoConnect,
		onDisconnectCallback,
		onAccountsChangedCallback,
		onChainChangedCallback,
		setDumb,
	} = walletStore

	const connector = computed(() => walletStore.walletState.connector)
	const isConnected = computed(() => walletStore.isConnected)
	const address = computed(() => walletStore.walletState.address)
	const chainId = computed(() => walletStore.walletState.chainId)
	const provider = computed(() => walletStore.walletState.provider)

	function onConnected(callback: OnConnectedCB) {
		watch(isConnected, (val, oldVal) => {
			if (val && !oldVal) {
				invariant(provider.value, 'VueDappError: useVueDapp-onConnected-provider')
				invariant(address.value, 'VueDappError: useVueDapp-onConnected-address')
				invariant(chainId.value, 'VueDappError: useVueDapp-onConnected-chainId')

				callback &&
					callback({
						provider: toRaw(provider.value),
						address: toRaw(address.value),
						chainId: toRaw(chainId.value),
					})
			}
		})
	}

	function onAccountOrChainIdChanged(callback: OnAccountOrChainIdChangedCB) {
		watch(address, (val, oldVal) => {
			if (oldVal && val) {
				invariant(provider.value, 'VueDappError: useVueDapp-onAccountOrChainIdChanged-watchAddress-provider')
				invariant(address.value, 'VueDappError: useVueDapp-onAccountOrChainIdChanged-watchAddress-address')
				invariant(chainId.value, 'VueDappError: useVueDapp-onAccountOrChainIdChanged-watchAddress-chainId')

				callback &&
					callback({
						provider: toRaw(provider.value),
						address: toRaw(address.value),
						chainId: toRaw(chainId.value),
					})
			}
		})

		watch(chainId, (val, oldVal) => {
			if (val !== -1 && val && oldVal) {
				invariant(provider.value, 'VueDappError: useVueDapp-onAccountOrChainIdChanged-watchChainId-provider')
				invariant(address.value, 'VueDappError: useVueDapp-onAccountOrChainIdChanged-watchChainId-address')
				invariant(chainId.value, 'VueDappError: useVueDapp-onAccountOrChainIdChanged-watchChainId-chainId')

				callback &&
					callback({
						provider: toRaw(provider.value),
						address: toRaw(address.value),
						chainId: toRaw(chainId.value),
					})
			}
		})
	}

	function onWalletUpdated(callback: OnWalletUpdatedCB) {
		onConnected(callback)
		onAccountOrChainIdChanged(callback)
	}

	function onDisconnected(callback: OnDisconnectedCB) {
		const { isConnected } = storeToRefs(useWalletStore(pinia))

		watch(isConnected, (val, oldVal) => {
			if (!val && oldVal) {
				callback && callback()
			}
		})
	}

	const { status, error } = storeToRefs(useWalletStore(pinia))

	return {
		...useConnectors(pinia),
		...useEIP6963(pinia),

		walletState: computed(() => walletStore.walletState),
		connector,
		isConnected,
		address,
		chainId,
		provider,

		status,
		error,

		onConnected,
		onAccountOrChainIdChanged,
		onWalletUpdated,
		onDisconnected,

		connectTo,
		disconnect,
		resetWallet,
		autoConnect,
		onDisconnectCallback,
		onAccountsChangedCallback,
		onChainChangedCallback,
		setDumb,
	}
}
