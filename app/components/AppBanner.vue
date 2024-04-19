<script setup lang="ts">
// source: https://github.com/nuxt/nuxt.com/blob/main/components/AppBanner.vue
const props = defineProps<{
	id: number | string
	to: string
}>()

const id = `hide-banner-${props.id}`

const hideBanner = () => {
	localStorage.setItem(id, 'true')

	document.querySelector('html')?.classList.add('hide-banner')
}
</script>

<template>
	<NuxtLink
		:to="to"
		class="block relative bg-teal-300 hover:bg-teal-300/60 transition-[background] backdrop-blur z-50 app-banner"
		external
		target="_blank"
	>
		<div class="py-3 px-5">
			<div class="flex items-center justify-between gap-2">
				<div class="lg:flex-1 hidden lg:flex items-center" />

				<div class="text-sm font-medium text-white dark:text-gray-900">
					<slot />
				</div>

				<div class="flex items-center justify-end lg:flex-1">
					<button class="rounded-md inline-flex hover:bg-teal-300/60" @click.prevent="hideBanner">
						<Icon name="i-heroicons-x-mark-20-solid" class="w-5 h-5 text-white dark:text-gray-900" />
					</button>
				</div>
			</div>
		</div>
	</NuxtLink>
</template>

<style scoped>
.hide-banner .app-banner {
	display: none;
}
</style>
