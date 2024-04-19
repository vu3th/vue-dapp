<script setup lang="ts">
import { ref } from 'vue'
import { BrowserWalletConnector, useVueDapp } from '@vue-dapp/core'
import VueDappModal from './VueDappModal.vue'
import { useVueDappModal } from './store'

const store = useVueDappModal()

const isModalOpen = ref(false)

const { error, isConnected, address, chainId, disconnect, addConnector } = useVueDapp()

addConnector(new BrowserWalletConnector())

function onClickConnectButton() {
	if (!isConnected.value) {
		isModalOpen.value = true
		// store.open()
	} else {
		disconnect()
	}
}

function connectErrorHandler(err: any) {
	console.error('ConnectError', err)
}
function autoConnectErrorHandler(err: any) {
	console.error('AutoConnectError', err)
}
</script>

<template>
	<div>
		<button @click="onClickConnectButton">{{ isConnected ? 'Disconnect' : 'Connect Wallet' }}</button>
		<button @click="store.open">open</button>

		<div>{{ error }}</div>
		<p v-if="chainId">Chain ID: {{ chainId }}</p>
		<p>{{ address }}</p>

		<VueDappModal
			v-model="isModalOpen"
			autoConnect
			:autoConnectBrowserWalletIfSolo="false"
			dark
			:connectErrorHandler="connectErrorHandler"
			:autoConnectErrorHandler="autoConnectErrorHandler"
		/>
	</div>
</template>
