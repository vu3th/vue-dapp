import { computed, markRaw, ref, watchEffect, Ref } from 'vue-demi'
import {
  Web3Provider,
  Network,
  ExternalProvider,
} from '@ethersproject/providers'
import { Signer } from 'ethers'
import { useWallet } from './useWallet'

export function useEthers() {
  const { status, provider: walletProvider } = useWallet()

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

    const _provider = new Web3Provider(walletProvider.value as ExternalProvider)
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
    provider: provider as Ref<Web3Provider | null>, // for fixing index.d.ts compiled error, see issue/10:
    signer,
    network,
    address,
    chainId,
    setup,
  }
}
