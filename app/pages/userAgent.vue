<script setup lang="ts">
import { isMobileBrowser } from '@vue-dapp/core'

const userAgent = ref('')

onMounted(() => {
	userAgent.value = navigator.userAgent
})
</script>

<template>
	<div class="p-5">
		<div>
			{{ userAgent }}
		</div>

		<hr />

		<ClientOnly>
			<div>isMobileBrowser: {{ isMobileBrowser() }}</div>
		</ClientOnly>
	</div>
</template>

<style lang="scss"></style>
