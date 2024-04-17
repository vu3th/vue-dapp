<script setup lang="ts">
import pkg from '~/package.json'
import { shortenAddress, useVueDapp } from '@vue-dapp/core'
import type { ConnWallet } from '../../packages/core/dist'

const { address, chainId, status, error, disconnect, onConnected, onDisconnected } = useVueDapp()
const dappStore = useDappStore()

const ensName = ref('')

onConnected(async (wallet: ConnWallet) => {
	const ens = await dappStore.provider.lookupAddress(wallet.address)
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
