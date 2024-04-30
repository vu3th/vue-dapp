<script setup lang="ts">
import { shortenAddress, useVueDapp } from '@vue-dapp/core'
import { useVueDappModal } from '@vue-dapp/modal'
import type { ConnWallet } from '@vue-dapp/core'
import { ethers } from 'ethers'
import type { Header, Item } from 'vue3-easy-data-table'

useHead({
	title: '', // To prevent redirection from the /overview to the index.vue while keeping the tab as Overview.
})

const defaultProvider = new ethers.JsonRpcProvider('https://ethereum-rpc.publicnode.com')

const { wallet, isConnected, disconnect, onWalletUpdated, onDisconnected } = useVueDapp()

const {
	ensName,
	loading: ensLoading,
	fetch: fetchEnsName,
	ignorePreviousFetch: ignorePreviousFetchEnsName,
} = useEnsName(defaultProvider)

const {
	balance,
	loading: balanceLoading,
	fetch: fetchBalance,
	ignorePreviousFetch: ignorePreviousFetchBalance,
} = useBalance(defaultProvider)

onMounted(() => {
	if (isConnected.value) {
		fetchEnsName(wallet.address!)
		fetchBalance(wallet.address!)
	}
})

onWalletUpdated((wallet: ConnWallet) => {
	fetchEnsName(wallet.address)
	fetchBalance(wallet.address)
})

onDisconnected(() => {
	ignorePreviousFetchEnsName()
	ignorePreviousFetchBalance()
})

function onClickConnectButton() {
	if (isConnected.value) disconnect()
	else useVueDappModal().open()
}

const headers: Header[] = [
	{ text: 'Name', value: 'name' },
	{ text: 'Value', value: 'value' },
]

const items = computed<Item[]>(() => [
	{
		name: 'Connector',
		value: wallet.connectorName ?? 'N/A',
	},
	{
		name: 'Provider Name',
		value: wallet.providerInfo?.name ?? 'N/A',
	},
	{
		name: 'RDNS',
		value: wallet.providerInfo?.rdns ?? 'N/A',
	},
	{
		name: 'Chain ID',
		value: wallet.chainId ?? 'N/A',
	},
	{
		name: 'Address',
		value: wallet.address ? shortenAddress(wallet.address) : 'N/A',
	},
	{
		name: 'Balance',
		value: balanceLoading.value ? 'Loading...' : isConnected.value ? balance.value : 'N/A',
	},
	{
		name: 'ENS',
		value: ensLoading.value ? 'Loading...' : ensName.value || 'N/A',
	},
])
</script>

<template>
	<div class="pb-14">
		<!-- banner -->
		<div class="mt-5 flex flex-col items-center justify-center">
			<img class="w-90" src="/logo.png" alt="logo" />
			<p class="bold text-md md:text-xl px-4 text-gray-500 text-center">{{ $t('subtitle') }}</p>
		</div>

		<div class="mt-10 px-10 flex flex-col items-center justify-center gap-5">
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

			<p class="text-red-500 text-center" v-if="wallet.error">{{ wallet.error }}</p>

			<ClientOnly>
				<Vue3EasyDataTable
					class="min-w-[240px]"
					hide-rows-per-page
					hide-footer
					:headers="headers"
					:items="items"
				>
				</Vue3EasyDataTable>
			</ClientOnly>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.wallet-table {
	min-width: 240px;
}
</style>
