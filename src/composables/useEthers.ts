import { computed, markRaw, ref, Ref } from 'vue-demi'
import {
  Web3Provider,
  Network,
  ExternalProvider,
} from '@ethersproject/providers'
import { Signer } from 'ethers'
import { useWallet } from './useWallet'

const isActivated = ref(false)
const provider = ref<Web3Provider | null>(null)
const signer = ref<Signer | null>(null)
const network = ref<Network | null>(null)
const address = ref('')
const balance = ref<bigint>(BigInt(0))

const clear = () => {
  isActivated.value = false
  provider.value = null
  signer.value = null
  network.value = null
  address.value = ''
  balance.value = BigInt(0)
}

export function useEthers() {
  const {
    isConnected,
    provider: walletProvider,
    onConnected,
    onDisconnect,
    onAccountsChanged,
    onChainedChanged,
  } = useWallet()

  onConnected(async () => await activate())
  onDisconnect(() => clear())
  onAccountsChanged(async () => {
    clear()
    await activate()
  })
  onChainedChanged(async () => {
    clear()
    await activate()
  })

  async function activate() {
    if (!isConnected.value) {
      throw new Error('useEthers: wallet is not connected')
    }

    const _provider = new Web3Provider(walletProvider.value as ExternalProvider)
    const _signer = _provider.getSigner()
    const _network = await _provider.getNetwork()
    const _address = await _signer.getAddress()
    const _balance = await _signer.getBalance()

    provider.value = markRaw(_provider)
    signer.value = markRaw(_signer)
    network.value = _network
    address.value = _address
    balance.value = _balance.toBigInt()

    isActivated.value = true
  }

  const chainId = computed(() => network.value?.chainId)

  return {
    // state
    isActivated,
    provider: provider as Ref<Web3Provider | null>, // for fixing index.d.ts compiled error, see issue/10:
    signer,
    network,
    address,
    balance,

    // getters
    chainId,

    // methods
    activate,
  }
}
