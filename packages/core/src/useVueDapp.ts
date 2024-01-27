import { useEIP6963 } from './services/eip6963'
import { useConnectors } from './services/connectors'
import { useListeners } from './services/listeners'
import { useWallet } from './services/wallet'

export function useVueDapp(pinia?: any) {
	return {
		...useConnectors(pinia),
		...useEIP6963(pinia),
		...useListeners(pinia),
		...useWallet(pinia),
	}
}
