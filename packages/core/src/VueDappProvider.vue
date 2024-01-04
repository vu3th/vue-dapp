<script setup lang="ts">
import { WalletContext, useVueDapp } from './useVueDapp'

const props = withDefaults(
	defineProps<{
		pinia?: any
	}>(),
	{},
)

const emit = defineEmits<{
	(e: 'connect', context: WalletContext): void
	(e: 'disconnect'): void
}>()

const { onWalletUpdated, onDisconnected } = useVueDapp(props.pinia)

onWalletUpdated(async ({ address, provider, chainId }: WalletContext) => {
	emit('connect', {
		provider,
		address,
		chainId,
	})
})

onDisconnected(() => {
	emit('disconnect')
})
</script>

<template>
	<div>
		<slot />
	</div>
</template>
