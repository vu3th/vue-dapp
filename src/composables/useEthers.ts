import { computed, markRaw, ref, watchEffect } from 'vue-demi'
import { Web3Provider, Network } from '@ethersproject/providers'
import { providers, Signer } from 'ethers'
import { useWallet } from './useWallet'

export function useEthers() {
  const { status, provider: externalProvider } = useWallet()

  const provider = ref<Web3Provider | null>(null)
  const signer = ref<Signer | null>(null)
  const network = ref<Network | null>(null)
  const address = ref('')

  watchEffect(() => {
    if (status.value === 'connected') {
      setup()
    } else if (status.value === 'none') {
      cleanState()
    }
  })

  async function setup() {
    if (status.value !== 'connected') {
      throw new Error('useEthers: wallet is not connected')
    }

    const _provider = markRaw(
      new Web3Provider(externalProvider.value as providers.ExternalProvider),
    )
    const _signer = _provider.getSigner()
    const _network = await _provider.getNetwork()
    const _address = await _signer.getAddress()

    provider.value = markRaw(_provider)
    signer.value = markRaw(_signer)
    network.value = _network
    address.value = _address
  }

  function cleanState() {
    provider.value = null
    signer.value = null
    network.value = null
    address.value = ''
  }

  const chainId = computed(() => network.value?.chainId)

  return {
    provider,
    signer,
    network,
    address,
    chainId,
    setup,
  }
}
