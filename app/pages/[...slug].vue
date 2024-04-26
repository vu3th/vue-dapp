<script setup lang="ts">
/**
	- https://github.com/tailwindlabs/tailwindcss-typography
 */

const route = useRoute()
const { locale } = useI18n()

/**
 * @docs queryContent https://content.nuxt.com/composables/query-content
 */
async function fetchContent() {
	try {
		return await queryContent(locale.value.toLowerCase(), route.path).findOne()
	} catch (err: any) {
		return await queryContent(route.path).findOne()
	}
}

/**
 * @docs https://nuxt.com/docs/api/composables/use-async-data
 */
const { data } = await useAsyncData('content', () => fetchContent(), {
	watch: [locale],
})
</script>

<template>
	<main class="py-5 px-5 sm:px-10 break-words">
		<ContentRenderer class="prose prose-zinc" :value="data">
			<template #empty>
				<p>Stay tuned; it will be added later 😉</p>
			</template>
		</ContentRenderer>
	</main>
</template>
