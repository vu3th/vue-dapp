<script setup lang="ts">
const { address, chainId, wallet } = useVueDapp()

// TODO: when connected, get the wallet twice
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
			<img class="w-90" src="@/assets/logo.png" alt="logo" />
			<p class="bold text-md px-4 sm:text-xl text-gray-600">Vue library for building DApps</p>
		</div>

		<div class="mt-10 px-10 flex flex-col items-center justify-center">
			<p v-if="chainId" class="text-gray-600 text-sm">Chain ID: {{ chainId }}</p>
			<p class="text-gray-600 text-xs">{{ address }}</p>
		</div>
	</div>
</template>

<style lang="scss"></style>
