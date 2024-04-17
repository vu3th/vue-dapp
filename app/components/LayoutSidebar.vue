<script setup lang="ts">
import { NIcon } from 'naive-ui'
import { BookOutline as BookIcon, PersonOutline as PersonIcon, WineOutline as WineIcon } from '@vicons/ionicons5'
import { NuxtLink } from '#components'

function renderIcon(icon: Component) {
	return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/overview',
				},
				{ default: () => 'Overview' },
			),
		key: 'Overview',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/wallet',
				},
				{ default: () => 'Wallet' },
			),
		key: 'Wallet',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/vue-dapp-provider',
				},
				{ default: () => 'VueDappProvider' },
			),
		key: 'VueDappProvider',
	},
	{
		label: 'Examples',
		key: 'Examples',
		children: [
			{
				label: 'Contract',
				key: 'Contract',
			},
			{
				label: 'Multicall',
				key: 'Multicall',
			},
			{
				label: 'Switch chain',
				key: 'Switch chain',
			},
		],
	},
]
</script>

<template>
	<n-layout-sider
		bordered
		show-trigger
		collapse-mode="width"
		:collapsed-width="64"
		:width="240"
		:native-scrollbar="false"
	>
		<n-menu :collapsed-width="64" :collapsed-icon-size="20" :options="menuOptions" />
	</n-layout-sider>
</template>

<style lang="scss"></style>
