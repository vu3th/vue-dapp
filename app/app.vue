<script lang="ts" setup>
import { BrowserWalletConnector, useVueDapp, type ConnWallet, VueDappProvider } from '@vue-dapp/core'
import { WalletConnectConnector } from '@vue-dapp/walletconnect'
import { CoinbaseWalletConnector } from '@vue-dapp/coinbase'
import { ethers } from 'ethers'
import { useDappStore } from '@/stores/useDappStore'
import { VueDappModal } from '@vue-dapp/modal'
import '@vue-dapp/modal/dist/style.css'
import { INFURA_ID } from './constants'

const dappStore = useDappStore()

const { addConnectors } = useVueDapp()
if (process.client) {
	addConnectors([
		new BrowserWalletConnector(),
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
	])
}

async function handleConnect({ provider, address, chainId }: ConnWallet) {
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

function handleConnectError(err: any) {
	console.error('AppError:', err)
}

function handleAutoConnectError(err: any) {
	console.error('AppError:', err)
}
</script>

<template>
	<NuxtLayout>
		<NuxtLoadingIndicator />

		<VueDappProvider @connect="handleConnect" @disconnect="handleDisconnect">
			<NuxtPage />

			<ClientOnly>
				<VueDappModal
					v-model="dappStore.connectModalOpen"
					autoConnect
					:connectErrorHandler="handleConnectError"
					:autoConnectErrorHandler="handleAutoConnectError"
				/>
			</ClientOnly>
		</VueDappProvider>
	</NuxtLayout>
</template>
