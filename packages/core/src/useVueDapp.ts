import { computed, watch, toRaw } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from './useWalletStore'
import { WalletProvider } from './types'
import invariant from 'tiny-invariant'

export type WalletContext = {
	provider: WalletProvider
	address: string
	chainId: number
}

export type OnConnectedCB = (context: WalletContext) => void
export type OnAccountOrChainIdChangedCB = (context: WalletContext) => void
export type OnDisconnectedCB = () => void
export type OnWalletUpdatedCB = (context: WalletContext) => void

export function useVueDapp(pinia: any) {
	const walletStore = useWalletStore(pinia)
	const {
		isConnected: _isConnected,
		address: _address,
		chainId: _chainId,
		provider: _provider,
		error,
		status,
	} = storeToRefs(walletStore)
	const {
		connectWith,
		disconnect,
		resetWallet,
		autoConnect,
		onDisconnectCallback,
		onAccountsChangedCallback,
		onChainChangedCallback,
		setDumb,
	} = walletStore

	const isConnected = computed(() => _isConnected.value)
	const address = computed(() => _address.value)
	const chainId = computed(() => _chainId.value)
	const provider = computed(() => _provider.value)

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
			if (val !== -1 && val && oldVal > 0) {
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

	return {
		isConnected,
		address,
		chainId,
		provider,

		error,
		status,

		onConnected,
		onAccountOrChainIdChanged,
		onWalletUpdated,
		onDisconnected,

		connectWith,
		disconnect,
		resetWallet,
		autoConnect,
		onDisconnectCallback,
		onAccountsChangedCallback,
		onChainChangedCallback,
		setDumb,
	}
}
