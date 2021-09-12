import { computed, markRaw, ref, Ref, onMounted, watch } from 'vue-demi'
import {
  Web3Provider,
  Network,
  ExternalProvider,
} from '@ethersproject/providers'
import { Signer } from 'ethers'
import { useWallet, ConnectionState } from './useWallet'

interface ProviderState {
  provider: Web3Provider
  signer: Signer
  network: Network
  address: string
}

export function useEthers() {
  const { status, provider: walletProvider } = useWallet()

  const provider = ref<Web3Provider | null>(null)
  const signer = ref<Signer | null>(null)
  const network = ref<Network | null>(null)
  const address = ref('')

  const onConnectedCallback = ref<(state: ProviderState) => void>(() => {})

  onMounted(async () => {
    if (status.value === 'connected') {
      await setup()
    }
  })

  watch(status, async (status: ConnectionState) => {
    if (status === 'connected') {
      await setup()
      onConnectedCallback.value({
        provider: provider.value!,
        signer: signer.value!,
        network: network.value!,
        address: address.value!,
      })
    } else if (status === 'none') {
      cleanState()
    }
  })

  async function onConnected(cb: (state: ProviderState) => void) {
    onConnectedCallback.value = cb
  }

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
    onConnected,
  }
}
