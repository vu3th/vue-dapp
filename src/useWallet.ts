import { computed, markRaw, reactive, ref } from 'vue-demi'
import { Web3Provider, Network } from '@ethersproject/providers'
import { BigNumber, ethers, providers, Signer, utils } from 'ethers'
import { displayEther } from './utils/format'
import { Wallet } from './constants'
import { useWalletconnect } from './wallet'
import { isDev } from './config'

// state:connect
const isConnected = ref(false)
const provider = ref<Web3Provider | null>(null)
const isConnecting = ref(false)
const connectError = ref('')

// state:setup
const signer = ref<Signer | null>(null)
const network = ref<Network | null>()
const address = ref('')
const balance = ref<BigNumber>(BigNumber.from(0))
const isLoading = ref(false)
const setupError = ref('')

// mutations
async function setupProvider(wallet: Wallet) {
  let _provider: Web3Provider | undefined

  switch (wallet) {
    case Wallet.metamask:
      isDev && console.log('setup metamask')
      break
    case Wallet.walletconnect:
      isDev && console.log('setup walletconnect')
      const { getProvider } = useWalletconnect()
      const walletconnect = await getProvider()
      _provider = new providers.Web3Provider(walletconnect)
      break
  }

  if (_provider) {
    provider.value = markRaw(_provider)
  } else {
    throw new Error('fail to get external provider')
  }
}

const setupWallet = (provider: Web3Provider) => {}
const cleanWallet = () => {
  isConnected.value = false
  provider.value = null
  isConnecting.value = false
  connectError.value = ''

  cleanSetupState()
}

const cleanSetupState = () => {
  signer.value = null
  network.value = null
  address.value = ''
  balance.value = BigNumber.from(0)
  isLoading.value = false
  setupError.value = ''
}

export function useWallet() {
  function connect() {}
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
    connectError ? connectError : setupError ? setupError : '',
  )
  // filters
  const displayBalance = (fixed: number = 2): string => {
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
    setupError,

    connect,
    disconnect,
    updateBalance,
    signTransaction,
    signMessage,
    signTypedData,

    chainId,
    error,

    displayBalance,
  }
}
