import { defineStore } from 'pinia'
import { Connector } from '@vue-dapp/core'

export type ConnectionStatus = 'none' | 'connecting' | 'loading' | 'connected'

export const useWalletStore = defineStore({
	id: 'vd-wallet',
	state: () => ({
		wallet: {
			status: 'none',
		},
	}),
	actions: {
		connectWith(connector: Connector, timeout?: number) {
			console.log('connectWith')
		},
		autoConnect(connectors: Connector[]) {
			console.log('autoConnect')
		},
	},
})
