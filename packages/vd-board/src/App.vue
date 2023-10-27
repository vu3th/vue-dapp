<script setup lang="ts">
import Board from './components/Board.vue'
import { useBoardStore } from './stores/useBoardStore'
import { MetaMaskConnector } from '@vue-dapp/core'

const connectors = [new MetaMaskConnector()]

function connectErrorHandler(err: any) {
	console.error('ConnectError', err)
}
function autoConnectErrorHandler(err: any) {
	console.error('AutoConnectError', err)
}

const { open } = useBoardStore()
</script>

<template>
	<div>
		<button @click="open">Connect</button>
		<Board
			:connectors="connectors"
			dark
			:autoConnectErrorHandler="autoConnectErrorHandler"
			:connectErrorHandler="connectErrorHandler"
		/>
	</div>
</template>
./stores/useBoardStore
