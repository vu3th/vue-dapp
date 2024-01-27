<script setup lang="ts">
import { WalletConnected } from './types'
import { useVueDapp } from './useVueDapp'

const props = withDefaults(
	defineProps<{
		pinia?: any
	}>(),
	{},
)

const emit = defineEmits<{
	(e: 'connect', wallet: WalletConnected): void
	(e: 'disconnect'): void
}>()

const { onWalletUpdated, onDisconnected } = useVueDapp(props.pinia)

onWalletUpdated((wallet: WalletConnected) => {
	emit('connect', wallet)
})

onDisconnected(() => {
	emit('disconnect')
})
</script>

<template>
	<slot />
</template>
