import { watch, toRaw, onMounted } from 'vue'
import { OnConnectedCB, OnDisconnectedCB } from '../types'
import { useConnect } from './connect'
import { assertConnected } from '../utils/assert'

export function listeners(pinia?: any) {
	const { isConnected, address, chainId, wallet } = useConnect(pinia)

	function watchConnected(callback: OnConnectedCB, options?: { immediate: boolean }) {
		if (options?.immediate) {
			onMounted(() => {
				if (isConnected.value) {
					assertConnected(wallet, 'listeners - watchConnected - immediate')
					callback && callback(toRaw(wallet))
				}
			})
		}

		return watch(isConnected, (val, oldVal) => {
			if (val && !oldVal) {
				assertConnected(wallet, 'listeners - watchConnected - watch')
				callback && callback(toRaw(wallet))
			}
		})
	}

	function watchAddressChanged(callback: OnConnectedCB, options?: { immediate: boolean }) {
		if (options?.immediate) {
			onMounted(() => {
				if (isConnected.value) {
					assertConnected(wallet, 'listeners - watchAddressChanged - immediate')
					callback && callback(toRaw(wallet))
				}
			})
		}

		return watch(address, (val, oldVal) => {
			if (oldVal && val) {
				assertConnected(wallet, 'listeners - watchAddressChanged - watch')
				callback && callback(toRaw(wallet))
			}
		})
	}

	function watchChainIdChanged(callback: OnConnectedCB, options?: { immediate: boolean }) {
		if (options?.immediate) {
			onMounted(() => {
				if (isConnected.value) {
					assertConnected(wallet, 'listeners - watchChainIdChanged - immediate')
					callback && callback(toRaw(wallet))
				}
			})
		}

		return watch(chainId, (val, oldVal) => {
			if (val && oldVal) {
				assertConnected(wallet, 'listeners - watchChainIdChanged - watch')
				callback && callback(toRaw(wallet))
			}
		})
	}

	function watchAddressChainIdChanged(callback: OnConnectedCB, options?: { immediate: boolean }) {
		if (options?.immediate) {
			onMounted(() => {
				if (isConnected.value) {
					assertConnected(wallet, 'listeners - watchAddressChainIdChanged - immediate')
					callback && callback(toRaw(wallet))
				}
			})
		}

		const unwatchAddress = watchAddressChanged(callback)
		const unwatchChainId = watchChainIdChanged(callback)

		return () => {
			unwatchAddress()
			unwatchChainId()
		}
	}

	function watchWalletChanged(callback: OnConnectedCB, options?: { immediate: boolean }) {
		if (options?.immediate) {
			onMounted(() => {
				if (isConnected.value) {
					assertConnected(wallet, 'listeners - watchWalletChanged - immediate')
					callback && callback(toRaw(wallet))
				}
			})
		}

		const unwatch1 = watchConnected(callback)
		const unwatch2 = watchAddressChainIdChanged(callback)

		return () => {
			unwatch1()
			unwatch2()
		}
	}

	function watchDisconnect(callback: OnDisconnectedCB, options?: { immediate: boolean }) {
		if (options?.immediate) {
			onMounted(() => {
				if (!isConnected.value) {
					callback && callback()
				}
			})
		}

		return watch(isConnected, (val, oldVal) => {
			if (!val && oldVal) {
				callback && callback()
			}
		})
	}

	return {
		watchConnected,
		watchAddressChanged,
		watchChainIdChanged,
		watchAddressChainIdChanged,
		watchWalletChanged,
		watchDisconnect,
	}
}
