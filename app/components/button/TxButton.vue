<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
	defineProps<{
		disabled?: boolean
	}>(),
	{
		disabled: false,
	},
)

const disabled = computed(() => {
	return props.disabled
})
</script>

<template>
	<BaseButton v-bind="$attrs" :disabled="disabled"></BaseButton>
</template>

<style lang="scss"></style>
