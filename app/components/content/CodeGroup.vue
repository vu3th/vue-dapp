<script setup lang="ts">
import type { RendererElement, RendererNode } from 'vue'
import CopyButton from '@/components/button/CopyButton.vue'

const slots = useSlots()

type Slot = VNode<
	RendererNode,
	RendererElement,
	{
		[key: string]: any
		props?: SlotProps
	}
>

type SlotProps = {
	class: string
	code: string
	filename: string
	language: string
	meta: string
	style: string
}

function isTag(slot: any, tag: string) {
	return slot.type && slot.type.tag && slot.type.tag === tag
}

function isCodeTag(slot: Slot) {
	return isTag(slot, 'code-block') || isTag(slot, 'code') || isTag(slot, 'pre')
}

const defaultSlots = computed<Slot[]>(() => {
	const res = slots.default?.() || []
	// console.log(res)
	return res
})

const tabs = computed(() => {
	return defaultSlots.value
		.filter(slot => isCodeTag(slot))
		.map((slot, index) => {
			return {
				label: slot.props?.filename || slot.props?.label || `${index}`,
				language: slot.props?.language || null,
				active: slot.props?.active || false,
				component: slot,
			}
		})
})

const activeTabIndex = ref(0)
</script>

<template>
	<div>
		<n-tabs v-model:value="activeTabIndex" type="card" size="small" :tabs-padding="5">
			<n-tab-pane v-for="(tab, index) in tabs" :key="index" :name="index" :tab="tab.label" style="padding: 0">
				<div
					v-for="(slot, index) in defaultSlots"
					:key="index"
					:style="{ display: index === activeTabIndex ? 'block' : 'none' }"
				>
					<div v-if="isCodeTag(slot)">
						<component class="m-0" :is="slot" />
					</div>
				</div>
			</n-tab-pane>

			<template #suffix>
				<CopyButton class="mr-3 text-lg" :content="defaultSlots[activeTabIndex].props?.code" />
			</template>
		</n-tabs>
	</div>
</template>

<style scoped>
/* :deep(.n-tabs-nav) {
	--n-tab-text-color-active: #42b883;
} */
</style>
