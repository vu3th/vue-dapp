import { computed, markRaw, ref, Ref, onMounted, watch } from 'vue-demi'
import {
  Web3Provider,
  Network,
  ExternalProvider,
} from '@ethersproject/providers'
import { Signer, BigNumber } from 'ethers'
import { useWallet, ConnectionState } from './useWallet'
import { MULTICALL2_ADDRESS, useMulticall } from './useMulticall'

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

    // multicall
    const {
      multicall,
      returnData,
      call,
      lastBlockNumber: _lastBlockNumber,
    } = useMulticall(_provider)

    const calls = [
      {
        target: MULTICALL2_ADDRESS,
        callData: multicall.interface.encodeFunctionData(
          'getCurrentBlockTimestamp',
        ),
      },
      { target: MULTICALL2_ADDRESS, callData: multicall.interface.encodeFunctionData('getEthBalance', [_address]) }, // prettier-ignore
    ]

    await call(calls)

    const [timestampEncoded, ethBalanceEncoded] = returnData.value
    const { timestamp: _timestamp } = multicall.interface.decodeFunctionResult('getCurrentBlockTimestamp', timestampEncoded.returnData); // prettier-ignore
    const { balance: _balance } = multicall.interface.decodeFunctionResult(
      'getEthBalance',
      ethBalanceEncoded.returnData,
    )

    provider.value = markRaw(_provider)
    signer.value = markRaw(_signer)
    network.value = _network
    address.value = _address
    balance.value = (_balance as BigNumber).toBigInt()
    lastBlockNumber.value = _lastBlockNumber.value
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
