<script setup lang="ts">
import { ConnWallet } from './types'
import { useVueDapp } from './useVueDapp'

const props = withDefaults(
	defineProps<{
		pinia?: any
	}>(),
	{},
)

const emit = defineEmits<{
	(e: 'connect', wallet: ConnWallet): void
	(e: 'disconnect'): void
}>()

const { onWalletUpdated, onDisconnected } = useVueDapp(props.pinia)

onWalletUpdated((wallet: ConnWallet) => {
	emit('connect', wallet)
})

onDisconnected(() => {
	emit('disconnect')
})
</script>

<template>
	<slot />
</template>
