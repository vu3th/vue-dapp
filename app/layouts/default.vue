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

const sidebarMenu = [
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

const showDrawer = ref(false)
</script>

<template>
	<n-layout content-class="flex flex-col" position="absolute">
		<n-layout-header bordered class="grid grid-cols-2">
			<div class="flex items-center">
				<!-- drawer button -->
				<div class="pl-5 md:hidden flex justify-center items-center" @click="() => (showDrawer = true)">
					<Icon size="20" name="ic:baseline-sort" class="hover:cursor-pointer hover:text-primary-dark" />
				</div>
				<!-- logo -->
				<n-menu mode="horizontal" :options="headerLeftMenu" />
			</div>
			<!-- right side menu -->
			<div class="place-self-end">
				<n-menu mode="horizontal" :options="headerRightMenu" />
			</div>
		</n-layout-header>

		<n-layout has-sider class="flex-1">
			<!-- sidebar -->
			<n-layout-sider
				class="hidden md:block"
				bordered
				collapse-mode="width"
				:collapsed-width="0"
				:width="240"
				:native-scrollbar="false"
			>
				<n-menu :collapsed-width="64" :collapsed-icon-size="20" :options="sidebarMenu" default-expand-all />
			</n-layout-sider>

			<!-- pages -->
			<n-layout>
				<slot />
			</n-layout>

			<!-- top-down drawer -->
			<n-drawer v-model:show="showDrawer" height="100vh" placement="top" :trap-focus="false">
				<n-drawer-content closable>
					<template #header>
						<NuxtLink to="/" class="h-5 flex justify-center items-center gap-1" @click="showDrawer = false">
							<img class="w-5" src="/sheaf-of-rice/favicon-32x32.png" alt="" />
							<p class="text-gray-500 text-sm">Vue Dapp</p>
						</NuxtLink>
					</template>
					<n-menu :options="sidebarMenu" default-expand-all />
				</n-drawer-content>
			</n-drawer>
		</n-layout>

		<n-layout-footer bordered> </n-layout-footer>
	</n-layout>
</template>
