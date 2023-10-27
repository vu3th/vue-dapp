import { defineStore } from 'pinia'

export const useBoardStore = defineStore({
	id: 'vd-board',
	state: () => ({
		boardOpen: false,
	}),
	actions: {
		open() {
			this.boardOpen = true
		},
		close() {
			this.boardOpen = false
		},
	},
})
