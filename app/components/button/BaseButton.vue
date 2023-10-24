<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
	defineProps<{
		text?: string
		loading?: boolean
		disabled?: boolean
	}>(),
	{
		text: '',
		loading: false,
		disabled: false,
	},
)

const disabled = computed(() => {
	if (props.loading) {
		return true
	}
	return props.disabled
})
</script>

<template>
	<div>
		<button v-bind="$attrs" class="base-btn" :disabled="disabled">
			<Icon name="i-svg-spinners:3-dots-fade" v-if="loading" />
			<div v-else>
				<p>
					<slot></slot>
				</p>
				<p v-if="!$slots['default']">{{ text }}</p>
			</div>
		</button>
	</div>
</template>

<style lang="scss">
.base-btn {
	@apply min-w-[50px] h-[36px] text-primary-dark bg-primary-light py-2 px-4 rounded flex justify-center items-center;
	transition: background-color 0.2s ease;

	&:hover {
		@apply bg-primary-dark text-primary-light;
	}

	&:disabled {
		@apply bg-primary-light text-primary-dark;
	}
}
</style>
