import { computed } from 'vue'
import { EIP6963AnnounceProviderEvent, EIP6963ProviderDetail, RDNS } from '../types'
import { useStore } from '../store'

export function useEIP6963(pinia?: any) {
	const walletStore = useStore(pinia)

	function subscribe() {
		window.addEventListener('eip6963:announceProvider', (event: EIP6963AnnounceProviderEvent) => {
			// console.log('eip6963:announceProvider -> detail', event.detail)
			_addProviderDetail(event.detail)
		})

		window.dispatchEvent(new CustomEvent('eip6963:requestProvider'))
	}

	function _addProviderDetail(detail: EIP6963ProviderDetail) {
		if (walletStore.providerDetails.some(({ info }) => info.uuid === detail.info.uuid)) return
		walletStore.providerDetails.push(detail) // why detail cannot be markRaw()? it will lead to "TypeError: Cannot define property __v_skip, object is not extensible"
	}

	function getProviderDetail(rdns: string | RDNS): EIP6963ProviderDetail | undefined {
		return walletStore.providerDetails.find(({ info }) => info.rdns === rdns)
	}

	return {
		// state
		providerDetails: computed(() => walletStore.providerDetails),

		// getters
		hasInjectedProvider: computed(() => typeof window !== 'undefined' && !!window.ethereum),
		isProviderAnnounced: computed(() => walletStore.providerDetails.length > 0),

		subscribe,
		getProviderDetail,
	}
}
