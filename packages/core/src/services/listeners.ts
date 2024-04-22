import { watch, toRaw, computed } from 'vue'
import { OnConnectedCB, OnAccountOrChainIdChangedCB, OnWalletUpdatedCB, OnDisconnectedCB } from '../types'
import { assertConnected } from '../utils/assert'
import { Connector, Wallet } from '../types'

// TODO: should return unwatch handler

export function useListeners(store: { wallet: Wallet; connectors: Connector[] }) {
	const { wallet } = store

	const isConnected = computed(() => wallet.status === 'connected')

	function onConnected(callback: OnConnectedCB) {
		watch(isConnected, (val, oldVal) => {
			if (val && !oldVal) {
				assertConnected(wallet, 'useListeners - onConnected')
				callback && callback(toRaw(wallet))
			}
		})
	}

	function onAccountOrChainIdChanged(callback: OnAccountOrChainIdChangedCB) {
		// TODO: make sure this works
		watch(
			() => wallet.address,
			(val, oldVal) => {
				if (oldVal && val) {
					assertConnected(wallet, 'useListeners - onAccountOrChainIdChanged - address')
					callback && callback(toRaw(wallet))
				}
			},
		)

		watch(
			() => wallet.chainId,
			(val, oldVal) => {
				if (val && oldVal) {
					assertConnected(wallet, 'useListeners - onAccountOrChainIdChanged - chainId')
					callback && callback(toRaw(wallet))
				}
			},
		)
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
