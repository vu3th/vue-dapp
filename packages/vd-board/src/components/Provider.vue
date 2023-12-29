<script setup lang="ts">
import { useVueDapp, WalletContext, Connector, MetaMaskConnector } from '@vue-dapp/core'
import Board from './Board.vue'

withDefaults(
	defineProps<{
		connectors?: Connector[]
	}>(),
	{
		connectors: () => [new MetaMaskConnector()],
	},
)

const emit = defineEmits<{
	(e: 'connect', context: WalletContext): void
	(e: 'disconnect'): void
}>()

const { onWalletUpdated, onDisconnected } = useVueDapp()

onWalletUpdated(async ({ address, provider, chainId }) => {
	emit('connect', {
		provider,
		address,
		chainId,
	})
})

onDisconnected(() => {
	emit('disconnect')
})

function connectErrorHandler(err: any) {
	console.error('ConnectError', err)
}
function autoConnectErrorHandler(err: any) {
	console.error('AutoConnectError', err)
}
</script>

<template>
	<div>
		<slot />

		<Board
			:connectors="connectors"
			dark
			autoConnect
			:autoConnectErrorHandler="autoConnectErrorHandler"
			:connectErrorHandler="connectErrorHandler"
		/>
	</div>
</template>
