<script lang="ts" setup>
import { NuxtLink } from '#components'
import packageJsonCore from '../../packages/core/package.json'

const headerLeftMenu = [
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/',
				},
				{ default: () => 'Vue Dapp' },
			),
		key: 'vue-dapp',
		icon: () => h('img', { src: '/sheaf-of-rice/favicon-32x32.png' }),
	},
]

const headerRightMenu = [
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: packageJsonCore.repository,
					external: true,
					target: '_blank',
				},
				{ default: () => 'Github' },
			),
		key: 'github',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: 'https://github.com/vu3th/vue-dapp/releases',
					external: true,
					target: '_blank',
				},
				{ default: () => 'v' + packageJsonCore.version },
			),
		key: 'version',
	},
]
</script>

<template>
	<n-layout content-class="flex flex-col" position="absolute">
		<n-layout-header bordered class="grid grid-cols-2">
			<div class=""><n-menu mode="horizontal" :options="headerLeftMenu" /></div>
			<div class="place-self-end">
				<n-menu mode="horizontal" :options="headerRightMenu" />
			</div>
		</n-layout-header>

		<n-layout has-sider class="flex-1">
			<LayoutSidebar />
			<n-layout>
				<slot />
			</n-layout>
		</n-layout>

		<n-layout-footer bordered> </n-layout-footer>
	</n-layout>
</template>
