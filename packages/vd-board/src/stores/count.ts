import { defineStore } from 'pinia'

export const useCount = defineStore({
	id: 'count',
	state: () => ({
		count: 0,
	}),
	actions: {
		inc() {
			this.count++
		},
		dec() {
			this.count--
		},
	},
})
