import { computed, markRaw, ref, Ref } from 'vue'
import {
  Web3Provider,
  Network,
  ExternalProvider,
} from '@ethersproject/providers'
import { BigNumber, Signer } from 'ethers'
import { NETWORK_DETAILS } from '../constants'
import { AddEthereumChainParameter } from '../wallets'

export type { Web3Provider, Signer, Network }

const isActivated = ref(false)
const provider = ref<Web3Provider | null>(null)
const signer = ref<Signer | null>(null)
const network = ref<Network | null>(null)
const address = ref('')
const dnsAlias = ref('')
const balance = ref<bigint>(BigInt(0))
let updateBalanceInterval: any

const availableNetworks = ref<{ [key: number]: AddEthereumChainParameter }>({
  ...NETWORK_DETAILS,
})

const deactivate = () => {
  clearInterval(updateBalanceInterval)
  isActivated.value = false
  provider.value = null
  signer.value = null
  network.value = null
  address.value = ''
  dnsAlias.value = ''
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
  let _network: any = null
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
  // Put it outside the timer as the lookup method can occasionally take longer than 5000ms
  dnsAlias.value = await lookupDNS(_network?.chainId, _address)

  clearInterval(updateBalanceInterval)
  const updateBalance = async (interval: number = 10000) => {
    updateBalanceInterval = setInterval(async () => {
      if (!signer.value) return
      const _balance = await signer?.value.getBalance()
      balance.value = _balance.toBigInt()
    }, interval)
  }

  updateBalance()

  isActivated.value = true
}

/**
 * @title Lookup DNS Alias such as ENS
 * @returns string
 */
async function lookupDNS(
  chainId: number,
  address: string,
  _provider?: Web3Provider,
) {
  try {
    switch (chainId) {
      /*  Ethereum  */
      case 1:
      case 3:
      case 4:
      case 5:
        //  ens will return the primary domain set by user.
        const _ens = await (_provider || provider.value)?.lookupAddress(address)
        return _ens || ''
      // case xxxx: //  Another or Custom DNS
      default:
        return ''
    }
  } catch (err) {
    // console.log('look err', err)
    return ''
  }
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
    dnsAlias,
    balance,
    availableNetworks,

    // getters
    chainId,

    // methods
    activate,
    deactivate,
    lookupDNS,
  }
}
