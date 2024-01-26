<script setup lang="ts">
import Board from './components/Board.vue'
import { BrowserWalletConnector, useVueDapp } from '@vue-dapp/core'
import { ref } from 'vue'

const isModalOpen = ref(true)

const { isConnected, address, chainId, disconnect, addConnector } = useVueDapp()

addConnector(new BrowserWalletConnector())

function onClickConnectButton() {
	if (!isConnected.value) {
		isModalOpen.value = false
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
		<p v-if="chainId">Chain ID: {{ chainId }}</p>
		<p>{{ address }}</p>

		<Board
			v-model="isModalOpen"
			dark
			autoConnect
			:connectErrorHandler="connectErrorHandler"
			:autoConnectErrorHandler="autoConnectErrorHandler"
		/>
	</div>
</template>
