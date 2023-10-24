<script setup lang="ts">
import copy from 'copy-to-clipboard'

withDefaults(
	defineProps<{
		content: string
	}>(),
	{},
)
</script>

<template>
	<i-ic-baseline-content-copy class="clickable" @click="copy(content)" />
</template>

<style lang="scss"></style>
