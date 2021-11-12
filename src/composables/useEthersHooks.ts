import { ref, watch } from 'vue'
import { Signer } from '@ethersproject/abstract-signer'
import { Network } from '@ethersproject/networks'
import { useEthers, Web3Provider } from './useEthers'

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

const { provider, signer, network, address, balance } = useEthers()

export function useEthersHooks() {
  const onActivatedHook = ref<OnActivatedHook | null>(null)
  const onDeactivatedHook = ref<OnDeactivatedHook | null>(null)
  const onChangedHook = ref<OnChangedHook | null>(null)

  watch(provider, (provider, oldProvider) => {
    if (!oldProvider && provider) {
      onActivatedHook.value &&
        onActivatedHook.value({
          provider,
          signer: signer.value!,
          network: network.value!,
          address: address.value,
          balance: balance.value,
        })
    } else if (oldProvider && provider) {
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
  const onDeactivated = (hook: OnDeactivatedHook) =>
    (onDeactivatedHook.value = hook)

  return {
    onActivated,
    onDeactivated,
    onChanged,
  }
}
