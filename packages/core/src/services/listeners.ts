import { watch, toRaw } from 'vue'
import { OnConnectedCB, OnAccountOrChainIdChangedCB, OnWalletUpdatedCB, OnDisconnectedCB } from '../types'
import { useConnect } from './connect'
import { assertConnected } from '../utils/assert'

// TODO: should return unwatch handler

export function useListeners(pinia?: any) {
	const { isConnected, address, chainId, wallet } = useConnect(pinia)

	function onConnected(callback: OnConnectedCB) {
		watch(isConnected, (val, oldVal) => {
			if (val && !oldVal) {
				assertConnected(wallet.value, 'useListeners - onConnected')
				callback && callback(toRaw(wallet.value))
			}
		})
	}

	function onAccountOrChainIdChanged(callback: OnAccountOrChainIdChangedCB) {
		// TODO: make sure this works
		watch(address, (val, oldVal) => {
			if (oldVal && val) {
				assertConnected(wallet.value, 'useListeners - onAccountOrChainIdChanged - address')
				callback && callback(toRaw(wallet.value))
			}
		})

		watch(chainId, (val, oldVal) => {
			if (val && oldVal) {
				assertConnected(wallet.value, 'useListeners - onAccountOrChainIdChanged - chainId')
				callback && callback(toRaw(wallet.value))
			}
		})
	}

	function onWalletUpdated(callback: OnWalletUpdatedCB) {
		onConnected(callback)
		onAccountOrChainIdChanged(callback)
	}

	function onDisconnected(callback: OnDisconnectedCB) {
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
