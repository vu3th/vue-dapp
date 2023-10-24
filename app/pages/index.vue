<script setup lang="ts">
import * as siwe from 'siwe'

function createSiweMessage(address: string): string {
	const siweMessage = new siwe.SiweMessage({
		domain: 'localhost:3000',
		address,
		statement: 'Welcome to myawesomedapp. Please login to continue.',
		uri: 'http://localhost:3000',
		version: '1',
		chainId: 1,
		nonce: '07EwlNV39F7FRRqpu',
	})
	return siweMessage.prepareMessage()
}

const siweMessage = ref('')

async function onSignSIWEMessage() {
	const { isConnected, user, signer } = storeToRefs(useDappStore())
	if (isConnected.value) {
		const message = createSiweMessage(user.value.address)
		siweMessage.value = await signer.value.signMessage(message)
	}
}
</script>

<template>
	<div class="flex flex-col items-center p-5 gap-2">
		<BaseButton @click="onSignSIWEMessage">Sign SIWE Message</BaseButton>

		<p class="w-full break-words">{{ siweMessage }}</p>
	</div>
</template>

<style lang="scss"></style>
