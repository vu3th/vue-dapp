<script setup lang="ts">
import { networkOptions, useDappStore } from '@/stores/useDappStore'

const dappStore = useDappStore()
</script>

<template>
	<div class="w-[160px]">
		<VueSelect
			:preservable="false"
			:clearable="false"
			:searchable="false"
			v-model="dappStore.network"
			:options="networkOptions"
		/>
	</div>
</template>

<style lang="scss"></style>
