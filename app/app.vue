<script lang="ts" setup>
import { MetaMaskConnector, type WalletContext } from '@vue-dapp/core'
import { WalletConnectConnector } from '@vue-dapp/walletconnect'
import { CoinbaseWalletConnector } from '@vue-dapp/coinbase'
import { ethers } from 'ethers'
import { useDappStore } from '@/stores/useDappStore'
import { DappProvider } from '@vue-dapp/vd-board'
import '@vue-dapp/vd-board/dist/style.css'
import { INFURA_ID } from './constants'

// why from /dist/types?
import type { WalletProvider } from '@vue-dapp/core/dist/types'

const dappStore = useDappStore()

interface EIP6963ProviderInfo {
	uuid: string
	name: string
	icon: string
	rdns: string
}

interface EIP6963ProviderDetail {
	info: EIP6963ProviderInfo
	provider: WalletProvider
}

interface EIP6963AnnounceProviderEvent extends CustomEvent {
	type: 'eip6963:announceProvider'
	detail: EIP6963ProviderDetail
}

export interface EIP6963RequestProviderEvent extends Event {
	type: 'eip6963:requestProvider'
}

declare global {
	interface WindowEventMap {
		'eip6963:announceProvider': EIP6963AnnounceProviderEvent
		'eip6963:requestProvider': EIP6963RequestProviderEvent
	}
}

if (process.client) {
	window.addEventListener('eip6963:announceProvider', (event: EIP6963AnnounceProviderEvent) => {
		console.log(event.detail.info.name)
	})

	window.dispatchEvent(new CustomEvent('eip6963:requestProvider'))
}

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
	new CoinbaseWalletConnector({
		appName: 'Vue Dapp',
		jsonRpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
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
