<script setup lang="ts">
import { useDappStore } from '@/stores/useDappStore'
import { storeToRefs } from 'pinia'
import { ethers } from 'ethers'

import { MetaMaskConnector, useWalletStore } from '@vue-dapp/core'
import { WalletConnectConnector } from '@vue-dapp/walletconnect'
import { Board } from '@vue-dapp/vd-board'
import '@vue-dapp/vd-board/dist/style.css'

const dappStore = useDappStore()
const { isConnected, user } = storeToRefs(dappStore)

const { onActivated, onChanged, onDeactivated, setDumb } = useWalletStore()
setDumb(false)

onActivated(async ({ address, provider, chainId }) => {
	console.log('onActivated')
	const ethersProvider = new ethers.BrowserProvider(provider)
	const signer = await ethersProvider.getSigner()

	dappStore.setUser({
		address,
		signer: markRaw(signer),
		chainId,
	})
})

onChanged(async ({ address, provider, chainId }) => {
	console.log('onChanged')

	const ethersProvider = new ethers.BrowserProvider(provider)
	const signer = await ethersProvider.getSigner()

	dappStore.setUser({
		address,
		signer: markRaw(signer),
		chainId,
	})
})

onDeactivated(() => {
	console.log('onDeactivated')

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
			desktopWallets: undefined,
			walletImages: undefined,
			mobileWallets: undefined,
			enableExplorer: true,
			privacyPolicyUrl: undefined,
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

		<Board
			:connectors="connectors"
			dark
			autoConnect
			:autoConnectErrorHandler="autoConnectErrorHandler"
			:connectErrorHandler="connectErrorHandler"
		/>
	</div>
</template>

<style lang="scss"></style>
