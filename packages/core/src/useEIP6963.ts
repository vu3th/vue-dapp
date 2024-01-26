import { computed } from 'vue'
import { EIP6963AnnounceProviderEvent, EIP6963ProviderDetail, RDNS } from './types'
import { useWalletStore } from './useWalletStore'

export function useEIP6963(pinia?: any) {
	const { providerDetails: _providerDetails } = useWalletStore(pinia)

	const hasInjectedProvider = computed(() => typeof window !== 'undefined' && !!window.ethereum)
	const isProviderAnnounced = computed(() => _providerDetails.length > 0)
	const providerDetails = computed(() => _providerDetails)

	function subscribe() {
		window.addEventListener('eip6963:announceProvider', (event: EIP6963AnnounceProviderEvent) => {
			// console.log('eip6963:announceProvider -> detail', event.detail)
			const detail = event.detail
			if (_providerDetails.some(({ info }) => info.uuid === detail.info.uuid)) return

			_providerDetails.push(detail)
		})

		window.dispatchEvent(new CustomEvent('eip6963:requestProvider'))
	}

	function getProviderDetail(rdns: string | RDNS): EIP6963ProviderDetail | undefined {
		return _providerDetails.find(({ info }) => info.rdns === rdns)
	}

	return {
		// state
		providerDetails,

		// getters
		hasInjectedProvider,
		isProviderAnnounced,

		subscribe,
		getProviderDetail,
	}
}
