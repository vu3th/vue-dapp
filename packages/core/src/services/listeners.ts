import { watch, toRaw } from 'vue'
import { OnConnectedCB, OnAccountOrChainIdChangedCB, OnWalletUpdatedCB, OnDisconnectedCB } from '../types'
import { useWallet } from './wallet'
import invariant from 'tiny-invariant'

// TODO: should return unwatch handler

export function useListeners(pinia?: any) {
	const { isConnected, status, connectorName, provider, providerInfo, connector, address, chainId } = useWallet(pinia)

	function onConnected(callback: OnConnectedCB) {
		watch(isConnected, (val, oldVal) => {
			if (val && !oldVal) {
				invariant(status.value === 'connected', 'useListeners - onConnected - status')
				invariant(connectorName.value, 'useListeners - onConnected - connectorName')
				invariant(provider.value, 'useListeners - onConnected - provider')
				if (connectorName.value === 'BrowserWallet') {
					invariant(providerInfo.value, 'useListeners - onConnected - providerInfo')
				}
				invariant(connector.value, 'useListeners - onConnected - connector')
				invariant(address.value, 'useListeners - onConnected - address')
				invariant(chainId.value, 'useListeners - onConnected - chainId')

				callback &&
					callback({
						status: status.value,
						error: null,
						connectorName: connectorName.value,
						provider: toRaw(provider.value),
						providerInfo: toRaw(providerInfo.value),
						connector: toRaw(connector.value),
						address: address.value,
						chainId: chainId.value,
					})
			}
		})
	}

	function onAccountOrChainIdChanged(callback: OnAccountOrChainIdChangedCB) {
		// TODO: make sure this works
		watch(address, (val, oldVal) => {
			if (oldVal && val) {
				invariant(status.value === 'connected', 'useListeners - onAccountOrChainIdChanged - status')
				invariant(connectorName.value, 'useListeners - onAccountOrChainIdChanged - connectorName')
				invariant(provider.value, 'useListeners - onAccountOrChainIdChanged - provider')
				if (connectorName.value === 'BrowserWallet') {
					invariant(providerInfo.value, 'useListeners - onAccountOrChainIdChanged - providerInfo')
				}
				invariant(connector.value, 'useListeners - onAccountOrChainIdChanged - connector')
				invariant(address.value, 'useListeners - onAccountOrChainIdChanged - address')
				invariant(chainId.value, 'useListeners - onAccountOrChainIdChanged - chainId')

				callback &&
					callback({
						status: status.value,
						error: null,
						connectorName: connectorName.value,
						provider: toRaw(provider.value),
						providerInfo: toRaw(providerInfo.value),
						connector: toRaw(connector.value),
						address: address.value,
						chainId: chainId.value,
					})
			}
		})

		watch(chainId, (val, oldVal) => {
			if (val && oldVal) {
				invariant(status.value === 'connected', 'useListeners - onAccountOrChainIdChanged - status')
				invariant(connectorName.value, 'useListeners - onAccountOrChainIdChanged - connectorName')
				invariant(provider.value, 'useListeners - onAccountOrChainIdChanged - provider')
				if (connectorName.value === 'BrowserWallet') {
					invariant(providerInfo.value, 'useListeners - onAccountOrChainIdChanged - providerInfo')
				}
				invariant(connector.value, 'useListeners - onAccountOrChainIdChanged - connector')
				invariant(address.value, 'useListeners - onAccountOrChainIdChanged - address')
				invariant(chainId.value, 'useListeners - onAccountOrChainIdChanged - chainId')

				callback &&
					callback({
						status: status.value,
						error: null,
						connectorName: connectorName.value,
						provider: toRaw(provider.value),
						providerInfo: toRaw(providerInfo.value),
						connector: toRaw(connector.value),
						address: address.value,
						chainId: chainId.value,
					})
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
