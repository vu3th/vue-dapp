import { defineStore } from 'pinia'

type BoardStoreState = {
	boardOpen: boolean
}

export const useBoardStore = defineStore('vd-board', {
	state: (): BoardStoreState => ({
		boardOpen: false,
	}),
	getters: {},
	actions: {
		open() {
			this.boardOpen = true
		},
		close() {
			this.boardOpen = false
		},
	},
})
