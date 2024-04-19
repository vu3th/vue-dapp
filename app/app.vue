<script lang="ts" setup>
import { BrowserWalletConnector, useVueDapp, type ConnWallet, VueDappProvider } from '@vue-dapp/core'
// import { WalletConnectConnector } from '@vue-dapp/walletconnect'
// import { CoinbaseWalletConnector } from '@vue-dapp/coinbase'
import { ethers } from 'ethers'
import { useDappStore } from '~/stores/dappStore'
import { VueDappModal } from '@vue-dapp/modal'
import '@vue-dapp/modal/dist/style.css'
import { lightTheme } from 'naive-ui'

useHead({
	titleTemplate: title => {
		if (title) return `${title} - Vue Dapp`
		else return 'Vue Dapp - Essential Web3 Tools for Vue Developers'
	},
})

const dappStore = useDappStore()

const { addConnectors } = useVueDapp()
if (process.client) {
	addConnectors([
		new BrowserWalletConnector(),
		// new WalletConnectConnector({
		// 	projectId: 'd1e65611568666138126d315c0bafd7d',
		// 	chains: [1],
		// 	showQrModal: true,
		// 	qrModalOptions: {
		// 		themeMode: 'light',
		// 		themeVariables: undefined,
		// 		desktopWallets: undefined,
		// 		walletImages: undefined,
		// 		mobileWallets: undefined,
		// 		enableExplorer: true,
		// 		privacyPolicyUrl: undefined,
		// 		termsOfServiceUrl: undefined,
		// 	},
		// }),
		// new CoinbaseWalletConnector({
		// 	appName: 'Vue Dapp',
		// 	jsonRpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
		// }),
	])
}

const ethersStore = useEthersStore()

async function handleConnect({ provider, address, chainId }: ConnWallet) {
	const ethersProvider = new ethers.BrowserProvider(provider)
	const signer = await ethersProvider.getSigner()

	dappStore.setUser({
		address,
		signer: markRaw(signer),
		chainId,
	})

	ethersStore.setWallet(provider)
}

function handleDisconnect() {
	dappStore.resetUser()
	ethersStore.resetWallet()
}
</script>

<template>
	<n-config-provider :theme="lightTheme">
		<NuxtLayout>
			<NuxtLoadingIndicator />

			<VueDappProvider @connect="handleConnect" @disconnect="handleDisconnect">
				<NuxtPage />

				<VueDappModal autoConnect />
			</VueDappProvider>
		</NuxtLayout>
	</n-config-provider>
</template>
