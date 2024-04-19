<script lang="ts" setup>
import { BrowserWalletConnector, useVueDapp, type ConnWallet } from '@vue-dapp/core'
import { VueDappModal } from '@vue-dapp/modal'
import '@vue-dapp/modal/dist/style.css'
// import { WalletConnectConnector } from '@vue-dapp/walletconnect'
// import { CoinbaseWalletConnector } from '@vue-dapp/coinbase'

import { lightTheme } from 'naive-ui'

useHead({
	titleTemplate: title => {
		if (title) return `${title} - Vue Dapp`
		else return 'Vue Dapp - Essential Web3 Tools for Vue Developers'
	},
})

const { addConnectors, onWalletUpdated, onDisconnected } = useVueDapp()
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

const { setWallet, resetWallet } = useEthers()

onWalletUpdated(async (wallet: ConnWallet) => {
	setWallet(wallet.provider)
})

onDisconnected(() => {
	resetWallet()
})
</script>

<template>
	<n-config-provider :theme="lightTheme">
		<NuxtLayout>
			<NuxtLoadingIndicator />

			<NuxtPage />

			<VueDappModal autoConnect />
		</NuxtLayout>
	</n-config-provider>
</template>
