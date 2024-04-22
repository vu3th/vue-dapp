import { RDNS } from '../types'

const LS_KEY = 'VUE_DAPP'

export function setLastConnectedBrowserWallet(rdns: RDNS | string) {
	window.localStorage.setItem(
		LS_KEY,
		JSON.stringify({
			lastConnectedWalletRdns: rdns,
		}),
	)
}

export function removeLastConnectedBrowserWallet() {
	const data = window.localStorage.getItem(LS_KEY)
	if (!data) return
	try {
		const { lastConnectedWalletRdns } = JSON.parse(data)
		if (lastConnectedWalletRdns) {
			window.localStorage.setItem(
				LS_KEY,
				JSON.stringify({
					lastConnectedWalletRdns: undefined,
				}),
			)
		}
	} catch {
		return
	}
}

export function getLastConnectedBrowserWallet(): RDNS | undefined {
	const data = window.localStorage.getItem(LS_KEY)
	if (!data) return
	try {
		const { lastConnectedWalletRdns } = JSON.parse(data)
		return lastConnectedWalletRdns
	} catch {
		return
	}
}
