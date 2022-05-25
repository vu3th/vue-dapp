import { computed, markRaw, ref, Ref } from 'vue'
import {
  Web3Provider,
  Network,
  ExternalProvider,
} from '@ethersproject/providers'
import { Signer } from 'ethers'

export type { Web3Provider, Signer, Network }

const isActivated = ref(false)
const provider = ref<Web3Provider | null>(null)
const signer = ref<Signer | null>(null)
const network = ref<Network | null>(null)
const address = ref('')
const balance = ref<bigint>(BigInt(0))

const deactivate = () => {
  isActivated.value = false
  provider.value = null
  signer.value = null
  network.value = null
  address.value = ''
  balance.value = BigInt(0)
}

async function activate(externalProvider: ExternalProvider) {
  if (!externalProvider)
    throw new Error('Failed to activate ethers: provider not found')

  // Test loading
  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(true)
  //   }, 2000)
  // })

  const _provider = new Web3Provider(externalProvider)
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

export function useEthers() {
  const chainId = computed(() => network.value?.chainId)

  return {
    // state
    isActivated,
    provider: provider as Ref<Web3Provider | null>, // for fixing index.d.ts compiled error, see issue/10:
    signer: signer as Ref<Signer | null>,
    network,
    address,
    balance,

    // getters
    chainId,

    // methods
    activate,
    deactivate,
  }
}
