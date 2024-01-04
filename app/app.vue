<script lang="ts" setup>
import { MetaMaskConnector, type WalletContext } from '@vue-dapp/core'
import { WalletConnectConnector } from '@vue-dapp/walletconnect'
import { ethers } from 'ethers'
import { useDappStore } from '@/stores/useDappStore'
import { DappProvider } from '@vue-dapp/vd-board'
import '@vue-dapp/vd-board/dist/style.css'

const dappStore = useDappStore()

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

async function handleConnect({ provider, address, chainId }: WalletContext) {
	console.log('handleConnect')
	const ethersProvider = new ethers.BrowserProvider(provider)
	const signer = await ethersProvider.getSigner()

	dappStore.setUser({
		address,
		signer: markRaw(signer),
		chainId,
	})
}

function handleDisconnect() {
	console.log('handleDisconnect')
	dappStore.resetUser()
}
</script>

<template>
	<NuxtLayout>
		<NuxtLoadingIndicator />

		<DappProvider :connectors="connectors" @connect="handleConnect" @disconnect="handleDisconnect">
			<NuxtPage />
		</DappProvider>
	</NuxtLayout>
</template>
