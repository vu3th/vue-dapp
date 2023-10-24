<script setup lang="ts">
import { MetaMaskConnector, WalletConnectConnector, useEthersHooks } from '@vue-dapp/legacy'
import { useDappStore } from '@/stores/useDappStore'
import { storeToRefs } from 'pinia'

const dappStore = useDappStore()
const { isConnected, user } = storeToRefs(dappStore)

const { onActivated, onChanged, onDeactivated } = useEthersHooks()

onActivated(({ signer, address, network }) => {
	dappStore.setUser({
		address,
		signer,
		chainId: network.chainId,
	})
})

onChanged(({ signer, address, network }) => {
	dappStore.setUser({
		address,
		signer,
		chainId: network.chainId,
	})
})

onDeactivated(() => {
	dappStore.resetUser()
})

const connectors = [
	new MetaMaskConnector(),
	new WalletConnectConnector({
		projectId: '3f3c98042b194264687bf59e104c534a',
		chains: [1],
		showQrModal: true,
		qrModalOptions: {
			themeMode: 'dark',
			themeVariables: undefined,
			chainImages: undefined,
			desktopWallets: undefined,
			walletImages: undefined,
			mobileWallets: undefined,
			enableExplorer: true,
			explorerAllowList: undefined,
			tokenImages: undefined,
			privacyPolicyUrl: undefined,
			explorerDenyList: undefined,
			termsOfServiceUrl: undefined,
		},
	}),
]

function connectErrorHandler(err: any) {
	console.error('ConnectError', err)
}
function autoConnectErrorHandler(err: any) {
	console.error('AutoConnectError', err)
}

watch(
	() => dappStore.network,
	() => {
		console.log('Network changed')
	},
)

watch(isConnected, () => {
	if (isConnected.value) {
		console.log('Wallet connected', user.value)
	} else {
		console.log('Wallet disconnected', user.value)
	}
})
</script>

<template>
	<div>
		<slot />

		<vd-board
			:connectors="connectors"
			dark
			:autoConnectErrorHandler="autoConnectErrorHandler"
			:connectErrorHandler="connectErrorHandler"
		/>
	</div>
</template>

<style lang="scss"></style>
