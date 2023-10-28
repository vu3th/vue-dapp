<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { shortenAddress, useWalletStore } from '@vue-dapp/core'
import copy from 'copy-to-clipboard'
import { useDappStore } from '@/stores/useDappStore'
import { useBoardStore } from '@vue-dapp/vd-board'

const { open } = useBoardStore()

const { disconnect } = useWalletStore()
const { connector, status, address, isConnected } = storeToRefs(useWalletStore())

const dappStore = useDappStore()
const { isNetworkUnmatched } = storeToRefs(dappStore)

async function onSwitchChain() {
	try {
		if (connector.value) {
			await connector.value.switchChain?.(dappStore.chainId)
		}
	} catch (err: any) {
		console.error(err)
	}
}
</script>

<template>
	<div>
		<div v-if="isConnected" class="flex items-center flex-col">
			<div
				class="h-[36px] px-4 rounded-3xl sm:inline-flex items-center gap-x-2 bg-gray-100"
				:class="isNetworkUnmatched ? 'border border-red-500' : ''"
			>
				<p v-if="isNetworkUnmatched" class="text-sm">Network Unmatched</p>
				<Icon
					name="i-ic:baseline-switch-access-shortcut"
					v-if="isNetworkUnmatched"
					class="clickable"
					@click="onSwitchChain"
				/>

				<p v-else>{{ shortenAddress(address) }}</p>

				<Icon
					name="i-ic-baseline-content-copy"
					v-if="!isNetworkUnmatched"
					class="clickable"
					@click="copy(address)"
				/>

				<Icon name="i-ic:baseline-logout" class="clickable" @click="disconnect" />
			</div>
		</div>

		<BaseButton class="rounded-3xl w-auto" v-else @click="open()" :disabled="status === 'connecting'">
			{{ status === 'connecting' ? 'Connecting...' : '' }}
			<Icon name="i-octicon-plug-24" v-if="status !== 'connecting'" />
		</BaseButton>
	</div>
</template>

<style lang="scss"></style>
