import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from './store'
import { useEIP6963 } from './services/eip6963'
import { useConnectors } from './services/connectors'
import { useWatch } from './services/watch'

export function useVueDapp(pinia?: any) {
	const walletStore = useStore(pinia)

	const {
		connectTo,
		disconnect,
		resetWallet,
		autoConnect,
		onDisconnectCallback,
		onAccountsChangedCallback,
		onChainChangedCallback,
		setDumb,
	} = walletStore

	const connector = computed(() => walletStore.walletState.connector)
	const isConnected = computed(() => walletStore.isConnected)
	const address = computed(() => walletStore.walletState.address)
	const chainId = computed(() => walletStore.walletState.chainId)
	const provider = computed(() => walletStore.walletState.provider)

	const { status, error } = storeToRefs(useStore(pinia))

	return {
		...useConnectors(pinia),
		...useEIP6963(pinia),
		...useWatch(pinia),

		walletState: computed(() => walletStore.walletState),
		connector,
		isConnected,
		address,
		chainId,
		provider,

		status,
		error,

		connectTo,
		disconnect,
		resetWallet,
		autoConnect,
		onDisconnectCallback,
		onAccountsChangedCallback,
		onChainChangedCallback,
		setDumb,
	}
}
