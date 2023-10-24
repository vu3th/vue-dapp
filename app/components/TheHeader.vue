<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { APP_NAME } from '@/constants'

const route = useRoute()
const router = useRouter()

const pages = computed(() => {
	return router.getRoutes().map(route => ({
		name: route.name as string,
		to: route.path,
	}))
})

// drawer (sidebar)
const isDrawerOpen = ref(false)
const drawer = ref(null)
onClickOutside(drawer, () => (isDrawerOpen.value = false))

function menuActiveClass(path: string) {
	return `${route.path === path ? 'menu-link--active' : ''}`
}

/**
 * @feat 調整 header 消失的螢幕寬度
 * (desktop) header lg:flex
 * (mobile) header lg:hidden
 * admin.vue aside lg:flex
 */
</script>

<template>
	<div class="mb-[var(--header-height)]">
		<header class="header frosted-glass-effect">
			<div class="flex items-center gap-x-3">
				<NuxtLink to="/">
					<div class="flex items-center text-primary-dark hover:text-secondary">
						{{ APP_NAME }}
					</div>
				</NuxtLink>
				<!-- <Icon
					name="svg-spinners:ring-resize"
					class="w-4 h-4 text-primary inline"
				/> -->
			</div>

			<div class="flex items-center gap-x-5">
				<NetworkStatus />
				<UserStatus />
			</div>
		</header>

		<!-- mobile header -->
		<header class="header-mobile frosted-glass-effect">
			<div class="flex">
				<div class="flex gap-x-4 items-center">
					<div class="" @click="() => (isDrawerOpen = true)">
						<Icon name="ic:baseline-sort" class="hover:cursor-pointer hover:text-primary-dark" />
					</div>

					<div>
						<NuxtLink class="" to="/"> {{ APP_NAME }} </NuxtLink>
					</div>
				</div>

				<!-- Drawer Menu -->
				<aside ref="drawer" class="drawer-menu" :class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'">
					<button
						class="absolute right-0 top-0 mr-4 mt-4 hover:cursor-pointer hover:text-primary-dark"
						@click="isDrawerOpen = false"
					>
						<Icon name="i-ep-close" />
					</button>

					<div class="mt-6">
						<div class="flex flex-col gap-x-4 gap-y-1" @click="() => (isDrawerOpen = false)">
							<NuxtLink
								v-for="page in pages"
								:key="page.name"
								class="menu-link"
								:to="page.to"
								:class="menuActiveClass(page.to)"
							>
								{{ page.name }}
							</NuxtLink>
						</div>
					</div>
				</aside>
			</div>

			<div class="flex gap-x-2">
				<NetworkStatus />
				<UserStatus />
			</div>
		</header>
	</div>
</template>

<style lang="scss" scoped>
.header {
	@apply fixed px-4 md:items-center lg:flex lg:justify-between left-0 top-0 hidden shadow-lg;
	height: var(--header-height);
	width: 100%;
	z-index: 10;
}

.header-mobile {
	@apply fixed px-4 flex justify-between items-center shadow-lg lg:hidden;
	left: 0;
	top: 0;
	height: var(--header-height);
	width: 100%;
	z-index: 10;

	.drawer-menu {
		@apply fixed w-3/5 sm:w-[300px] transform overflow-auto p-5 shadow-2xl transition-all duration-300 ease-in-out;
		height: 100vh;
		z-index: 30;
		top: 0;
		left: 0;
		background-color: white;
	}
}

.menu-link {
	@apply text-black rounded-md px-4 py-2 hover:bg-gray-200 md:flex md:justify-start md:min-w-[80px] lg:px-4;
}

.menu-link--active {
	@apply text-secondary bg-gray-200;
}
</style>
