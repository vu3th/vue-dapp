<script setup lang="ts">
import { BrowserWalletConnector, useVueDapp } from '@vue-dapp/core'
import { onMounted, ref } from 'vue'
import VueDappModal from './VueDappModal.vue'

const isModalOpen = ref(false)

const { error, isConnected, address, chainId, disconnect, addConnector, providerDetails } = useVueDapp()

addConnector(new BrowserWalletConnector())

function onClickConnectButton() {
	if (!isConnected.value) isModalOpen.value = true
	else disconnect()
}

// emit fake erc-6963 provider
onMounted(() => {
	for (let i = 0; i < 1; i++) {
		window.dispatchEvent(
			new CustomEvent('eip6963:announceProvider', {
				detail: {
					info: {
						uuid: 'test-wallet-' + Math.random(),
						name: 'Test Wallet',
						icon: 'https://placehold.co/150',
						rdns: 'com.test.wallet',
					},
					provider: window.ethereum,
				},
			}),
		)
	}
})
</script>

<template>
	<div>
		<button @click="onClickConnectButton">{{ isConnected ? 'Disconnect' : 'Connect Wallet' }}</button>

		<div>{{ error }}</div>
		<p v-if="chainId">Chain ID: {{ chainId }}</p>
		<p>{{ address }}</p>

		<VueDappModal v-model="isModalOpen" dark auto-connect autoConnectBrowserWalletIfSolo />
	</div>
</template>
