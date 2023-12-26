<script setup lang="ts">
import { watchImmediate } from '@vueuse/core'
import { useDappStore } from '@/stores/useDappStore'
import pkg from '../../packages/core/package.json'

const dappStore = useDappStore()

watchImmediate(
	() => dappStore.network,
	async () => {
		try {
			await dappStore.fetchBlockNumber()
		} catch (err: any) {
			console.error(err)
		}
	},
)

const interval = setInterval(async () => {
	try {
		await dappStore.fetchBlockNumber()
	} catch (err: any) {
		clearInterval(interval)
	}
}, 4200)
</script>

<template>
	<footer
		class="px-2 h-[20px] text-xs text-gray-800 bg-gray-200 fixed bottom-0 flex justify-between items-center w-full"
	>
		<Transition name="fade" mode="out-in">
			<!-- Note: must add key to enable transition animation -->
			<div :key="dappStore.blockNumber">
				{{ dappStore.blockNumber ? dappStore.blockNumber : '' }}
			</div>
		</Transition>

		<div class="flex items-center gap-x-2">
			<a class="text-black" href="https://github.com/vu3th/vue-dapp" target="_blank">
				<Icon name="i-mdi-github" />
			</a>
			<p>vue-dapp/core v{{ pkg.version }}</p>
		</div>
	</footer>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.8s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0.4;
}
</style>
