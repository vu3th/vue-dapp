import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', () => {
	const darkMode = ref(false)

	return {
		darkMode,
	}
})
