<script setup lang="ts">
import { ref } from 'vue'
import { BrowserWalletConnector, useVueDapp } from '@vue-dapp/core'
import VueDappModal from './VueDappModal.vue'

const isModalOpen = ref(false)

const { error, isConnected, address, chainId, disconnect, addConnector } = useVueDapp()

addConnector(new BrowserWalletConnector())

function onClickConnectButton() {
	if (!isConnected.value) isModalOpen.value = true
	else disconnect()
}
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
