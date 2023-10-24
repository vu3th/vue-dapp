import { ref, watch } from 'vue'
import { Signer } from '@ethersproject/abstract-signer'
import { type Network } from '@ethersproject/networks'
import { type Web3Provider } from '@/composables/useEthers'

export type EthersHooksContext = {
	provider: Web3Provider
	signer: Signer
	network: Network
	address: string
	balance: bigint
}

export type OnActivatedHook = (context: EthersHooksContext) => void
export type OnChangedHook = (context: EthersHooksContext) => void
export type OnDeactivatedHook = () => void

const { provider, signer, network, address, balance, isActivated } = useEthers()

export function useEthersHooks() {
	const onActivatedHook = ref<OnActivatedHook | null>(null)
	const onDeactivatedHook = ref<OnDeactivatedHook | null>(null)
	const onChangedHook = ref<OnChangedHook | null>(null)

	watch(isActivated, (val, oldVal) => {
		if (!oldVal && val) {
			onActivatedHook.value &&
				onActivatedHook.value({
					provider: provider.value!,
					signer: signer.value!,
					network: network.value!,
					address: address.value,
					balance: balance.value,
				})
		}
	})

	watch(provider, (provider, oldProvider) => {
		if (oldProvider && provider) {
			onChangedHook.value &&
				onChangedHook.value({
					provider,
					signer: signer.value!,
					network: network.value!,
					address: address.value,
					balance: balance.value,
				})
		} else if (oldProvider && !provider) {
			onDeactivatedHook.value && onDeactivatedHook.value()
		}
	})

	const onActivated = (hook: OnActivatedHook) => (onActivatedHook.value = hook)
	const onChanged = (hook: OnChangedHook) => (onChangedHook.value = hook)
	const onDeactivated = (hook: OnDeactivatedHook) => (onDeactivatedHook.value = hook)

	return {
		onActivated,
		onDeactivated,
		onChanged,
	}
}
