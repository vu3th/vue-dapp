<script setup lang="ts">
import { CheckOutlined, ContentCopyFilled } from '@vicons/material'
import copy from 'copy-to-clipboard'
import { useThemeVars } from 'naive-ui'
const themeVars = useThemeVars()

const props = withDefaults(
	defineProps<{
		content: string
	}>(),
	{},
)

const state = ref<'init' | 'copied'>('init')

function onClickCopy() {
	copy(props.content)
	state.value = 'copied'
	window.setTimeout(() => {
		state.value = 'init'
	}, 2000)
}
</script>

<template>
	<n-button text :focusable="false" @click="onClickCopy">
		<n-icon v-if="state === 'copied'" class="w-5 h-5" :color="themeVars.primaryColor">
			<CheckOutlined />
		</n-icon>
		<n-icon v-else class="w-5 h-5">
			<ContentCopyFilled />
		</n-icon>
	</n-button>
</template>
