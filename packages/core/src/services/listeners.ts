import { watch, toRaw, onMounted } from 'vue'
import { OnConnectedCB, OnAccountOrChainIdChangedCB, OnWalletUpdatedCB, OnDisconnectedCB } from '../types'
import { useConnect } from './connect'
import { assertConnected } from '../utils/assert'

export function useListeners(pinia?: any) {
	const { isConnected, address, chainId, wallet } = useConnect(pinia)

	function onConnected(callback: OnConnectedCB) {
		return watch(isConnected, (val, oldVal) => {
			if (val && !oldVal) {
				assertConnected(wallet, 'useListeners - onConnected')
				callback && callback(toRaw(wallet))
			}
		})
	}

	function onAccountOrChainIdChanged(callback: OnAccountOrChainIdChangedCB) {
		const unwatchAddress = watch(address, (val, oldVal) => {
			if (oldVal && val) {
				assertConnected(wallet, 'useListeners - onAccountOrChainIdChanged - address')
				callback && callback(toRaw(wallet))
			}
		})

		const unwatchChainId = watch(chainId, (val, oldVal) => {
			if (val && oldVal) {
				assertConnected(wallet, 'useListeners - onAccountOrChainIdChanged - chainId')
				callback && callback(toRaw(wallet))
			}
		})

		return () => {
			unwatchAddress()
			unwatchChainId()
		}
	}

	function onWalletUpdated(callback: OnWalletUpdatedCB) {
		const unwatchConnected = onConnected(callback)
		const unwatchAccountOrChainId = onAccountOrChainIdChanged(callback)

		return () => {
			unwatchConnected()
			unwatchAccountOrChainId()
		}
	}

	function onDisconnected(callback: OnDisconnectedCB) {
		return watch(isConnected, (val, oldVal) => {
			if (!val && oldVal) {
				callback && callback()
			}
		})
	}

	function watchWalletUpdated(callback: OnWalletUpdatedCB, options?: { immediate: boolean }) {
		if (options?.immediate) {
			onMounted(() => {
				if (isConnected.value) {
					assertConnected(wallet, 'useListeners - watchWalletUpdated - immediate')
					callback && callback(toRaw(wallet))
				}
			})
		}

		const unwatchConnected = onConnected(callback)
		const unwatchAccountOrChainId = onAccountOrChainIdChanged(callback)

		return () => {
			unwatchConnected()
			unwatchAccountOrChainId()
		}
	}

	function watchDisconnect(callback: OnDisconnectedCB) {
		return watch(isConnected, (val, oldVal) => {
			if (!val && oldVal) {
				callback && callback()
			}
		})
	}

	return {
		onConnected,
		onAccountOrChainIdChanged,
		onWalletUpdated, // will be deprecated
		onDisconnected, // will be deprecated
		watchWalletUpdated,
		watchDisconnect,
	}
}
