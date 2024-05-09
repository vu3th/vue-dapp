import { onMounted, ref } from 'vue'
import { useConnect } from './services/connect'
import { ConnectOptions, ProviderTarget } from './types'
import { useConnectors } from './services/connectors'
import { getLastConnectedBrowserWallet } from './services/localStorage'
import { isWindowEthereumAvailable } from './utils'

export function useAutoConnect(pinia?: any) {
	const isAutoConnecting = ref(false)
	const error = ref<Error | null>(null)

	const { connectors } = useConnectors(pinia)
	const { connectTo } = useConnect(pinia)

	onMounted(async () => {
		try {
			isAutoConnecting.value = true
			if (isMobileAppBrowser()) {
				await autoConnect('window.ethereum')
			} else {
				await autoConnect('rdns')
			}
		} catch (err: any) {
			error.value = err
		} finally {
			isAutoConnecting.value = false
		}
	})

	async function autoConnect(target: ProviderTarget) {
		const browserWallet = connectors.value.find(conn => conn.name === 'BrowserWallet')
		if (!browserWallet) return

		let options: ConnectOptions<'BrowserWallet'>

		switch (target) {
			case 'window.ethereum':
				if (!isWindowEthereumAvailable) return
				options = {
					target: 'window.ethereum',
				}
				break
			case 'rdns':
				const lastRdns = getLastConnectedBrowserWallet()
				if (!lastRdns) return

				options = { target: 'rdns', rdns: lastRdns }
				break
			default:
				const err = new Error('target is required')
				error.value = err
				throw err
		}

		try {
			await connectTo('BrowserWallet', options)
		} catch (err: any) {
			error.value = err
			throw err
		}
	}

	return { isAutoConnecting, error }
}

/**
 * Check whether the browser is within a mobile app (such as a WebView) rather than a standalone mobile browser like Chrome App
 * @returns boolean
 */
export function isMobileAppBrowser() {
	const userAgent = navigator.userAgent

	// for ios
	if (!userAgent.includes('Safari/') && userAgent.includes('Mobile/')) {
		return true
	}

	// for android
	if (userAgent.includes('wv') || userAgent.includes('WebView')) {
		return true
	}

	return false
}
