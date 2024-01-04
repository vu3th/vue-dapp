<script setup lang="ts">
import Board from './components/Board.vue'
import { useBoardStore } from './stores/useBoardStore'
import { MetaMaskConnector, useVueDapp } from '@vue-dapp/core'

const connectors = [new MetaMaskConnector()]

function connectErrorHandler(err: any) {
	console.error('ConnectError', err)
}
function autoConnectErrorHandler(err: any) {
	console.error('AutoConnectError', err)
}

const boardStore = useBoardStore()

const { isConnected, address, chainId, disconnect } = useVueDapp()

function onClickConnectButton() {
	if (!isConnected.value) {
		boardStore.open()
	} else {
		disconnect()
	}
}
</script>

<template>
	<div>
		<button @click="onClickConnectButton">{{ isConnected ? 'Disconnect' : 'Connect Wallet' }}</button>
		<p v-if="chainId !== -1">Chain ID: {{ chainId }}</p>
		<p>{{ address }}</p>

		<Board
			:connectors="connectors"
			dark
			:autoConnectErrorHandler="autoConnectErrorHandler"
			:connectErrorHandler="connectErrorHandler"
		/>
	</div>
</template>
