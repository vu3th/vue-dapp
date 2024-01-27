import { watch, toRaw } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '../store'
import invariant from 'tiny-invariant'
import { OnConnectedCB, OnAccountOrChainIdChangedCB, OnWalletUpdatedCB, OnDisconnectedCB } from '../types/watch'

// TODO: should return unwatch handler

export function useWatch(pinia?: any) {
	const walletStore = useStore(pinia)

	const { provider, address, chainId } = storeToRefs(walletStore)

	function onConnected(callback: OnConnectedCB) {
		watch(
			() => walletStore.isConnected,
			(val, oldVal) => {
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
			},
		)
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
			if (val && oldVal) {
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
		const { isConnected } = storeToRefs(useStore(pinia))

		watch(isConnected, (val, oldVal) => {
			if (!val && oldVal) {
				callback && callback()
			}
		})
	}

	return {
		onConnected,
		onAccountOrChainIdChanged,
		onWalletUpdated,
		onDisconnected,
	}
}
