<script setup lang="ts">
import pkg from '~/package.json'
import { shortenAddress, useVueDapp } from '@vue-dapp/core'
import { useVueDappModal } from '@vue-dapp/modal'
import type { ConnWallet } from '@vue-dapp/core'
import { ethers, formatEther } from 'ethers'

useHead({
	title: '', // must add to prevent from redirecting from Overview to Vue Dapp but the tab is still Overview
})

const defaultProvider = new ethers.JsonRpcProvider('https://ethereum-rpc.publicnode.com')

const { wallet, isConnected, disconnect, onWalletUpdated, onDisconnected } = useVueDapp()

const ensName = ref('')
async function fetchENSName(address: string) {
	ensName.value = (await defaultProvider.lookupAddress(address)) ?? ''
}

const balance = ref(0)
async function fetchBalance(wallet: ConnWallet) {
	const provider = new ethers.BrowserProvider(wallet.provider)
	balance.value = Number(formatEther(await provider.getBalance(wallet.address)))
}

onMounted(() => {
	if (isConnected.value) {
		fetchENSName(wallet.address!)
		fetchBalance(wallet as ConnWallet)
	}
})

onWalletUpdated((wallet: ConnWallet) => {
	console.log('wallet', wallet)

	fetchENSName(wallet.address)
	fetchBalance(wallet)
})

onDisconnected(() => {
	ensName.value = ''
	balance.value = 0
})

function onClickConnectButton() {
	if (wallet.status === 'connected') {
		disconnect()
		return
	}
	const { open } = useVueDappModal()
	open()
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
				:loading="wallet.status === 'connecting'"
				:disabled="wallet.status === 'connecting'"
				@click="onClickConnectButton"
			>
				<p v-if="wallet.status === 'idle'">Connect Wallet</p>
				<p v-else-if="wallet.status === 'connecting'">Connecting...</p>
				<p v-if="wallet.status === 'connected'">Disconnect</p>
			</n-button>

			<p v-if="wallet.error">{{ wallet.error }}</p>

			<div class="text-gray-600 text-sm mt-5">
				<p v-if="wallet.chainId" class="">Chain ID: {{ wallet.chainId }}</p>
				<p v-if="wallet.address">{{ 'Address: ' + shortenAddress(wallet.address) }}</p>
				<p v-if="isConnected">{{ 'Balance: ' + balance }}</p>
				<p v-if="ensName">{{ 'ENS: ' + ensName }}</p>
			</div>
		</div>
	</div>
</template>

<style lang="scss"></style>
