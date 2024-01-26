<script setup lang="ts">
import Board from './components/Board.vue'
import { useBoardStore } from './useBoardStore'
import { BrowserWalletConnector, useVueDapp } from '@vue-dapp/core'

const boardStore = useBoardStore()

const { isConnected, address, chainId, disconnect, addConnector } = useVueDapp()

addConnector(new BrowserWalletConnector())

function onClickConnectButton() {
	if (!isConnected.value) {
		boardStore.open()
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
		<p v-if="chainId !== -1">Chain ID: {{ chainId }}</p>
		<p>{{ address }}</p>

		<Board dark :autoConnectErrorHandler="autoConnectErrorHandler" :connectErrorHandler="connectErrorHandler" />
	</div>
</template>
