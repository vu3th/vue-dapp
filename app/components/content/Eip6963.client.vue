<script setup lang="ts">
import { useVueDapp, shortenAddress, type ConnectorName, RDNS } from '@vue-dapp/core'
import { useVueDappModal } from '@vue-dapp/modal'

const { providerDetails, wallet, address, status, connectTo, disconnect, error, isConnected } = useVueDapp()
const { close } = useVueDappModal()

const providerList = computed(() => {
	return providerDetails.value.slice().sort((a, b) => {
		if (a.info.rdns === RDNS.rabby) return -1
		if (b.info.rdns === RDNS.rabby) return 1
		if (a.info.rdns === RDNS.metamask) return -1
		if (b.info.rdns === RDNS.metamask) return 1
		return 0
	})
})

async function onClickWallet(connName: ConnectorName, rdns?: RDNS | string) {
	close()
	await connectTo(connName, { rdns })
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="flex flex-wrap gap-2">
			<n-button
				v-for="detail in providerList"
				:key="detail.info.uuid"
				@click="onClickWallet('BrowserWallet', detail.info.rdns)"
				size="medium"
				:disabled="status === 'connecting' || wallet.providerInfo?.rdns === detail.info.rdns"
			>
				<div>{{ detail.info.name }}</div>
			</n-button>
		</div>

		<div>
			<div class="flex flex-col gap-1">
				<div v-if="status === 'connecting'">Connecting...</div>
				<div v-if="isConnected">{{ wallet.providerInfo?.name }} is connected.</div>
				<div v-if="isConnected">{{ shortenAddress(address || '') }}</div>
			</div>

			<p class="text-red-500">{{ error }}</p>
		</div>
	</div>
</template>

<style lang="scss"></style>
