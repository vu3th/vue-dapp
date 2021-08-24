import { computed, markRaw, ref } from 'vue-demi'
import { Web3Provider, Network } from '@ethersproject/providers'
import { BigNumber, providers, Signer } from 'ethers'
import { displayEther } from './utils/format'
import { Wallet } from './constants'
import { useMetamask } from './wallet'

export interface WalletSource {
  getProvider(): Promise<providers.ExternalProvider>
}

// state:connect
const isConnected = ref(false)
const provider = ref<Web3Provider | null>(null)
const isConnecting = ref(false)
const connectError = ref('')

// state:load
const signer = ref<Signer | null>(null)
const network = ref<Network | null>()
const address = ref('')
const balance = ref<BigNumber>(BigNumber.from(0))
const isLoading = ref(false)
const loadError = ref('')

export function useWallet() {
  async function connect(wallet: Wallet) {
    connectError.value = ''
    isConnecting.value = true
    try {
      await setupProvider(wallet)
      await setupWallet(provider.value!)
    } catch (e) {
      connectError.value = `fail to connect ${Wallet[wallet]}`
      throw new Error(e)
    } finally {
      isConnecting.value = false
    }

    isConnected.value = true
  }

  function disconnect() {
    cleanWallet()
  }

  function updateBalance() {}

  // signer methods
  function signTransaction() {}
  function signMessage() {}
  function signTypedData() {}

  // getters
  const chainId = computed(() => network.value?.chainId)
  const error = computed(() =>
    connectError ? connectError : loadError ? loadError : '',
  )
  // filters
  const fixedBalance = (fixed: number = 2): string => {
    return displayEther(balance.value, fixed)
  }

  return {
    isConnected,
    provider,
    isConnecting,
    connectError,

    signer,
    network,
    address,
    balance,
    isLoading,
    loadError,

    connect,
    disconnect,
    updateBalance,
    signTransaction,
    signMessage,
    signTypedData,

    chainId,
    error,

    fixedBalance,
  }
}

// mutations
async function setupProvider(wallet: Wallet) {
  let source: WalletSource | null = null

  switch (wallet) {
    case Wallet.metamask:
      source = useMetamask()
      break
    case Wallet.walletconnect:
      break
  }

  if (source) {
    provider.value = markRaw(new Web3Provider(await source.getProvider()))
  } else {
    throw new Error('fail to get wallet source')
  }
}

async function setupWallet(provider: Web3Provider) {
  const _signer = provider.getSigner()
  const _network = await provider.getNetwork()
  const _address = await _signer.getAddress()
  const _balance = await _signer.getBalance()

  signer.value = markRaw(_signer)
  network.value = _network
  address.value = _address
  balance.value = _balance
}

function cleanWallet() {
  isConnected.value = false
  provider.value = null
  isConnecting.value = false
  connectError.value = ''

  cleanAccount()
}

function cleanAccount() {
  signer.value = null
  network.value = null
  address.value = ''
  balance.value = BigNumber.from(0)
  isLoading.value = false
  loadError.value = ''
}
