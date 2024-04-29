<script setup lang="ts">
const userAgent = ref('')

onMounted(() => {
	userAgent.value = navigator.userAgent
})

function alertUserAgent() {
	alert(navigator.userAgent)
}
</script>

<template>
	<div>
		<div>
			{{ userAgent }}
		</div>

		<button @click="alertUserAgent">Alert userAgent</button>
	</div>
</template>

<style lang="scss"></style>
