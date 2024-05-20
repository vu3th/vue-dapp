import { onMounted, ref } from 'vue'
import { useConnect } from './services/connect'
import { ConnectOptions, ProviderTarget, RdnsEnum } from './types'
import { useConnectors } from './services/connectors'
import { getLastConnectedBrowserWallet } from './services/localStorage'
import { isMobileBrowser, isWindowEthereumAvailable } from './utils'
import { useEIP6963 } from './services/eip6963'

export function useAutoConnect(pinia?: any) {
	const isAutoConnecting = ref(false)
	const error = ref<Error | null>(null)

	const { connectors } = useConnectors(pinia)
	const { connectTo } = useConnect(pinia)

	onMounted(async () => {
		try {
			isAutoConnecting.value = true
			if (isMobileBrowser()) {
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

				/**
				 * feat: Don't auto-connect to MetaMask if it's locked
				 * issue#185: https://github.com/vu3th/vue-dapp/issues/185
				 */

				// if the wallet is MetaMask, check if it's unlocked
				if (lastRdns === RdnsEnum.metamask) {
					const { providerDetails } = useEIP6963()
					const providerDetail = providerDetails.value.find(p => p.info.rdns === RdnsEnum.metamask)
					if (providerDetail) {
						const provider = providerDetail.provider
						/**
						 * isUnlocked - API Docs: https://docs.metamask.io/wallet/reference/provider-api/#_metamaskisunlocked
						 * How to check if a web3 wallet is unlocked? - Stack Overflow: https://stackoverflow.com/questions/69015014/how-to-check-if-a-web3-wallet-is-unlocked
						 */
						// @ts-ignore
						const isUnlocked = await provider._metamask.isUnlocked()
						if (!isUnlocked) return
					}
				}

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
