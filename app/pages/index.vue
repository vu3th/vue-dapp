<script setup lang="ts">
import pkg from '~/package.json'
import { shortenAddress, useVueDapp } from '@vue-dapp/core'

const { address, chainId, wallet, status, error, disconnect, onConnected, onDisconnected } = useVueDapp()
const dappStore = useDappStore()

const ensName = ref('')

onConnected(async ({ address }) => {
	console.log('onConnected')
	const ens = await dappStore.provider.lookupAddress(address)
	if (ens) {
		ensName.value = ens
	}
})
onDisconnected(() => {
	ensName.value = ''
})

function onClickConnectButton() {
	if (status.value === 'connected') {
		disconnect()
		return
	}
	dappStore.connectModalOpen = !dappStore.connectModalOpen
}

// bug: when connected, get the wallet twice
if (process.client) {
	watch(
		wallet,
		() => {
			console.log('app -> index.vue -> wallet', wallet.value)
		},
		{
			immediate: true,
			deep: true,
		},
	)
}
</script>

<template>
	<div class="">
		<!-- banner -->
		<div class="mt-40 flex flex-col items-center justify-center">
			<img class="w-90" src="/logo.png" alt="logo" />
			<p class="bold text-md md:text-xl px-4 text-gray-500 text-center">
				{{ pkg.description }}
			</p>
		</div>

		<div class="mt-10 px-10 flex flex-col items-center justify-center gap-3">
			<n-button
				size="medium"
				:loading="status === 'connecting'"
				:disabled="status === 'connecting'"
				@click="onClickConnectButton"
			>
				<p v-if="status === 'idle'">Connect Wallet</p>
				<p v-else-if="status === 'connecting'">Connecting...</p>
				<p v-if="status === 'connected'">Disconnect</p>
			</n-button>

			<p v-if="error">{{ error }}</p>

			<div class="text-gray-600 text-sm mt-5">
				<p v-if="chainId" class="">Chain ID: {{ chainId }}</p>
				<p class="">{{ address && shortenAddress(address) }}</p>
				<p>{{ ensName }}</p>
			</div>
		</div>

		<!-- todo: Contract call/send -->
		<div class="mt-10 px-10 flex">
			<div></div>

			<div></div>
		</div>
	</div>
</template>

<style lang="scss"></style>
