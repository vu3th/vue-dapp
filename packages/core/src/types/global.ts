import { EIP1193Provider } from './eip1193'
import { EIP6963AnnounceProviderEvent, EIP6963RequestProviderEvent } from './eip6963'

declare global {
	interface Window {
		ethereum?: EIP1193Provider
	}
}

declare global {
	interface WindowEventMap {
		'eip6963:announceProvider': EIP6963AnnounceProviderEvent
		'eip6963:requestProvider': EIP6963RequestProviderEvent
	}
}
