import type { EIP1193Provider } from '@vue-dapp/core'
import { ethers } from 'ethers'
import { defineStore } from 'pinia'

export const useEthersStore = defineStore('EthersStore', {
	state: (): {
		provider: ethers.BrowserProvider | null
		signer: ethers.JsonRpcSigner | null
	} => ({
		provider: null,
		signer: null,
	}),
	getters: {},
	actions: {
		async setWallet(provider: EIP1193Provider) {
			const p = new ethers.BrowserProvider(provider)
			const signer = await p.getSigner()
			this.provider = p
			this.signer = markRaw(signer)
		},
		resetWallet() {
			this.provider = null
			this.signer = null
		},
	},
})
