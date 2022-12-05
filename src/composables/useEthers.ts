import { computed, markRaw, ref, Ref } from 'vue'
import {
  Web3Provider,
  Network,
  ExternalProvider,
} from '@ethersproject/providers'
import { BigNumber, Signer } from 'ethers'
import { NETWORK_DETAILS } from '../constants'
import { ActivateEthersError, AddEthereumChainParameter } from '../connectors'

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
  if (!externalProvider) throw new ActivateEthersError('provider not found')

  const _provider = new Web3Provider(externalProvider)
  const _signer = _provider.getSigner()

  let _network: any = null
  let _address = ''
  let _balance = BigNumber.from(0)

  const data = await getData()
  ;[_network, _address, _balance] = data!

  /**
   * @issue #27
   * @dev Throw error when walletConnect is not connected because of invalid infura id.
   * When you provide an invalid infura id, you can still open the qrcode and try connecting to it.
   * But the WalletConnect will keep polling, throwing errors, and the connecting status is stuck,
   * so the timeout is needed.
   */
  async function getData(timeout = 5000) {
    return Promise.race([
      Promise.all([
        _provider.getNetwork(),
        _signer.getAddress(),
        _signer.getBalance(),
      ]),
      new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          reject(new ActivateEthersError('Operation timed out'))
        }, timeout),
      ),
    ])
  }

  // async function testLoading() {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(true)
  //     }, 7000)
  //   })
  // }

  provider.value = markRaw(_provider)
  signer.value = markRaw(_signer)
  network.value = _network
  address.value = _address
  balance.value = _balance.toBigInt()

  // Put it outside the timer as the lookup method can occasionally take longer than 5000ms
  // Question: what if people don't need this variable but it lead to more connecting time?
  try {
    dnsAlias.value = await lookupDNS(_network?.chainId, _address)
  } catch (err: any) {
    throw new ActivateEthersError('Failed to look up DNS')
  }

  // Update ether balance every 10s
  // Question: how about update balance via provider.on('block', getBalance)
  clearInterval(updateBalanceInterval)
  const updateBalance = async (interval = 10000) => {
    updateBalanceInterval = setInterval(async () => {
      if (!signer.value) return
      try {
        const _balance = await signer?.value.getBalance()
        balance.value = _balance.toBigInt()
      } catch (error: any) {
        throw new Error('Failed to update balance')
      }
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
      case 5: {
        //  ens will return the primary domain set by user.
        const _ens = await (_provider || provider.value)?.lookupAddress(address)
        return _ens || ''
      }
      // case xxxx: //  Another or Custom DNSe
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
