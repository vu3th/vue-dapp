import { Plugin } from 'vue'
import { clickOutside } from './directive'
import Board from './components/Board.vue'
import Modal from './components/Modal.vue'
import { AddEthereumChainParameter } from './connectors'
import { NETWORK_DETAILS } from './constants'
import { useWallet, useEthers } from './composables'

export type PluginOptions = {
	autoConnect: boolean
	persistDisconnect?: boolean
	networks: {
		[key: number]: AddEthereumChainParameter
	}
	dumb: boolean
	connectTimeout?: number
}

export const VueDapp: Plugin = {
	install(app, options?: PluginOptions) {
		if (options && options.networks) {
			const { availableNetworks } = useEthers()
			availableNetworks.value = { ...NETWORK_DETAILS, ...options.networks }
		}

		app.provide('connectTimeout', options?.connectTimeout || undefined)
		app.provide('autoConnect', options?.autoConnect || false)
		if (options?.autoConnect && options?.persistDisconnect === false) {
			const { persistDisconnect } = useWallet()
			persistDisconnect.value = false
		}

		if (options?.dumb === false) {
			const { dumb } = useWallet()
			dumb.value = false
		}

		app.directive('click-outside', clickOutside)
		app.component('vd-board', Board)
		app.component('vd-modal', Modal)
	},
}
