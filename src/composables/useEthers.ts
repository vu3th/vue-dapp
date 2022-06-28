import { computed, markRaw, ref, Ref } from 'vue'
import {
  Web3Provider,
  Network,
  ExternalProvider,
} from '@ethersproject/providers'
import { BigNumber, Signer } from 'ethers'

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

  /**
   * @issue #27
   * @dev Catch error if walletConnect not connected because of invalid infura id.
   * if you provide an invalid infura id, you can still open the qrcode but can't connect to wallet.
   * WalletConnect will throw error and keep polling until timeout as follows.
   */
  let _network = null
  let _address = ''
  let _balance = BigNumber.from(0)
  const getData = (timeout: number = 5000) => {
    return new Promise(async (resolve: (val: any[]) => void, reject) => {
      try {
        setTimeout(() => {
          reject('Failed to activate ethers: timeout')
        }, timeout)
        _network = await _provider.getNetwork()
        _address = await _signer.getAddress()
        _balance = await _signer.getBalance()
        resolve([_network, _address, _balance])
      } catch (err: any) {
        reject(err)
      }
    })
  }

  try {
    await getData()
  } catch (err: any) {
    throw new Error(err)
  }

  provider.value = markRaw(_provider)
  signer.value = markRaw(_signer)
  network.value = _network
  address.value = _address
  balance.value = _balance.toBigInt()

  const updateBalance = async (interval: number = 10000) => {
    setInterval(async () => {
      const _balance = await _signer.getBalance()
      balance.value = _balance.toBigInt()
    }, interval)
  }

  updateBalance()

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
