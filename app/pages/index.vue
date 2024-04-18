<script setup lang="ts">
import pkg from '~/package.json'
import { shortenAddress, useVueDapp } from '@vue-dapp/core'
import type { ConnWallet } from '@vue-dapp/core'
import { formatEther } from 'ethers'

const { address, chainId, status, error, disconnect, onConnected, onDisconnected } = useVueDapp()
const dappStore = useDappStore()

const ensName = ref('')
async function fetchENSName(address: string) {
	ensName.value = (await dappStore.provider.lookupAddress(address)) ?? ''
}

const balance = ref(0n)
async function fetchBalance(address: string) {
	balance.value = await dappStore.provider.getBalance(address)
}

onConnected((wallet: ConnWallet) => {
	fetchENSName(wallet.address)
	fetchBalance(wallet.address)
})

onDisconnected(() => {
	ensName.value = ''
	balance.value = 0n
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
		<div class="mt-20 flex flex-col items-center justify-center">
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
				<p v-if="address">{{ 'Address: ' + shortenAddress(address) }}</p>
				<p v-if="balance">{{ 'Balance: ' + formatEther(balance) }}</p>
				<p v-if="ensName">{{ 'ENS: ' + ensName }}</p>
			</div>
		</div>
	</div>
</template>

<style lang="scss"></style>
