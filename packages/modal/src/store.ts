import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVueDappModal = defineStore('vd-modal-store', () => {
	const isModalOpen = ref(false)

	function open() {
		isModalOpen.value = true
	}

	function close() {
		isModalOpen.value = false
	}

	return {
		isModalOpen,
		open,
		close,
	}
})
