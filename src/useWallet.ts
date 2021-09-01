import { computed, markRaw, ref, Ref } from 'vue-demi'
import { Web3Provider, Network } from '@ethersproject/providers'
import { BigNumber, providers, Signer } from 'ethers'
import { displayEther } from './utils/format'
import { Wallet } from './constants'
import { useMetamask, useWalletconnect } from './walletsource'
import { WalletReturn } from './types'

export interface WalletSource {
  getProvider(): Promise<providers.ExternalProvider>
}

// state:connect
const isConnected = ref(false)
const provider = ref<Web3Provider | null>(null)
const connectError = ref('')
const walletType = ref<Wallet.metamask | Wallet.walletconnect | null>(null)

// state:load
const signer = ref<Signer | null>(null)
const network = ref<Network | null>(null)
const address = ref('')
const balance = ref<BigNumber>(BigNumber.from(0))
const loadError = ref('')

export function useWallet(): WalletReturn {
  async function connect(wallet: Wallet) {
    connectError.value = ''
    try {
      await setupProvider(wallet)
      await setupWallet(provider.value! as Web3Provider) // for type checking while building
    } catch (e: any) {
      // must add type 'any' for building
      connectError.value = `Failed to connect ${Wallet[wallet]}`
      throw new Error(e.message)
    }

    isConnected.value = true
  }

  function disconnect() {
    switch (walletType.value) {
      case Wallet.metamask:
        break
      case Wallet.walletconnect:
        const { disconnect } = useWalletconnect()
        disconnect()
        break
    }
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
    connectError.value
      ? connectError.value
      : loadError.value
      ? loadError.value
      : '',
  )
  // filters
  const fixedBalance = (fixed: number = 2): string => {
    return displayEther(balance.value, fixed)
  }

  return {
    isConnected,
    provider: provider as Ref<Web3Provider | null>, // for type checking while building
    connectError,

    signer,
    network,
    address,
    balance,
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

  walletType.value = wallet

  switch (walletType.value) {
    case Wallet.metamask:
      source = useMetamask()
      break
    case Wallet.walletconnect:
      source = useWalletconnect()
      break
  }

  if (source) {
    provider.value = markRaw(new Web3Provider(await source.getProvider()))
  } else {
    throw new Error('Failed to get wallet source')
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
  connectError.value = ''

  cleanAccount()
}

function cleanAccount() {
  signer.value = null
  network.value = null
  address.value = ''
  balance.value = BigNumber.from(0)
  loadError.value = ''
}
