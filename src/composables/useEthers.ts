import { computed, markRaw, ref, Ref, onMounted, watch } from 'vue-demi'
import {
  Web3Provider,
  Network,
  ExternalProvider,
} from '@ethersproject/providers'
import { Signer, BigNumber } from 'ethers'
import { useWallet, ConnectionState } from './useWallet'
import { useContractCalls } from './useContractCalls'
import { MULTICALL2_ABI, MULTICALL2_ADDRESS } from '../constants'
import { Contract } from '@ethersproject/contracts'
import { Multicall2 } from '../types/multicall2/Multicall2'

interface OnConntectedCallbackParams {
  provider: Web3Provider
  signer: Signer
  network: Network
}

export function useEthers() {
  const { status, provider: walletProvider, isConnected } = useWallet()

  const provider = ref<Web3Provider | null>(null)
  const signer = ref<Signer | null>(null)
  const network = ref<Network | null>(null)
  const address = ref('')
  const balance = ref<bigint>(BigInt(0))
  const lastBlockNumber = ref(0)
  const lastBlockTimestamp = ref(0)

  const onConnectedCallback = ref<(params: OnConntectedCallbackParams) => void>(
    () => {},
  )

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
      })
    } else if (status === 'none') {
      cleanState()
    }
  })

  async function onConnected(cb: (params: OnConntectedCallbackParams) => void) {
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

    const multicall = new Contract(
      MULTICALL2_ADDRESS,
      MULTICALL2_ABI,
      _provider,
    ) as Multicall2

    const { call, results, blockNumber } = useContractCalls(_provider, [
      {
        interface: multicall.interface,
        address: MULTICALL2_ADDRESS,
        method: 'getCurrentBlockTimestamp',
      },
      {
        interface: multicall.interface,
        address: MULTICALL2_ADDRESS,
        method: 'getEthBalance',
        args: [_address],
      },
    ])

    await call()

    const [{ timestamp: _timestamp }, { balance: _balance }] = results.value

    provider.value = markRaw(_provider)
    signer.value = markRaw(_signer)
    network.value = _network
    address.value = _address
    balance.value = (_balance as BigNumber).toBigInt()
    lastBlockNumber.value = blockNumber.value
    lastBlockTimestamp.value = (_timestamp as BigNumber).toNumber()
  }

  function cleanState() {
    provider.value = null
    signer.value = null
    network.value = null
    address.value = ''
    balance.value = BigInt(0)
    lastBlockNumber.value = 0
    lastBlockTimestamp.value = 0
  }

  const chainId = computed(() => network.value?.chainId)

  return {
    provider: provider as Ref<Web3Provider | null>, // for fixing index.d.ts compiled error, see issue/10:
    signer,
    network,
    address,
    balance,
    lastBlockNumber,
    lastBlockTimestamp,
    chainId,
    isConnected,
    setup,
    onConnected,
  }
}
