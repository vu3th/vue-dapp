import { ref, markRaw, Ref, computed } from 'vue-demi'
import Metamask, {
  MetaMaskProvider,
  MetaMaskProviderRpcError,
} from '../wallets/metamask'
import { WalletConnectProvider } from '../types/walletconnect'
import Walletconnect from '../wallets/walletconnect'

export type WalletProvider = MetaMaskProvider | WalletConnectProvider | null
export type ConnectionState = 'none' | 'connecting' | 'connected'
export type WalletName = 'none' | 'metamask' | 'walletconnect'

// state
const provider = ref<WalletProvider | null>(null)
const status = ref<ConnectionState>('none')
const walletName = ref<WalletName>('none')
const error = ref('')

export function useWallet() {
  async function connect(_walletName: WalletName, infuraAPI?: string) {
    let _provider: WalletProvider = null

    clear()

    try {
      status.value = 'connecting'
      switch (_walletName) {
        case 'metamask':
          _provider = (await Metamask.connect()) as MetaMaskProvider
          if (!_provider.isConnected)
            throw new Error('metamask is not connected')
          break
        case 'walletconnect':
          if (!infuraAPI)
            throw new Error(
              'You should provide infuraAPI for connecting WalletConnect',
            )
          _provider = (await Walletconnect.connect(
            infuraAPI,
          )) as WalletConnectProvider
          if (!_provider.connected)
            throw new Error('walletconnect is not connected')
          break
        default:
          throw new Error('Connect Error: wallet name not found')
      }
    } catch (err: any) {
      clear()
      error.value = `Failed to connect: ${err.message}`
      return
    }

    provider.value = markRaw(_provider)
    walletName.value = _walletName
    status.value = 'connected'

    // EIP-1193
    subscribeDisconnect()
    subscribeAccountsChanged()
    subscribeChainChanged()
  }

  async function disconnect() {
    // note: metamask can't disconnect by provider
    if (walletName.value === 'walletconnect') {
      await (provider.value as WalletConnectProvider).disconnect()
    }
    clear()
  }

  const isConnected = computed(() => {
    if (status.value === 'connected') return true
    else return false
  })

  return {
    provider: provider as Ref<WalletProvider | null>,
    status,
    walletName,
    error,
    isConnected,
    connect,
    disconnect,
  }
}

function clear() {
  provider.value = null
  status.value = 'none'
  walletName.value = 'none'
  error.value = ''
}

function subscribeDisconnect() {
  switch (walletName.value) {
    case 'metamask':
      ;(provider.value as MetaMaskProvider).on(
        'disconnect',
        (err: MetaMaskProviderRpcError) => {
          console.log('disconnect')
          clear()
          console.log(`MetaMask disconnect: ${err.message}`)
        },
      )
      break
    case 'walletconnect':
      // Q: why it trigger twice when user click disconnect?
      // source code: https://github.com/WalletConnect/walletconnect-monorepo/blob/0871582be273f8c21bb1351315d649ea47ee70b7/packages/providers/web3-provider/src/index.ts#L277
      ;(provider.value as WalletConnectProvider).on(
        'disconnect',
        (code: number, reason: string) => {
          clear()
          console.log(`WalletConnect disconnect: code:${code}: ${reason}`)
        },
      )
      break
  }
}

function subscribeAccountsChanged() {
  switch (walletName.value) {
    case 'metamask':
      ;(provider.value as MetaMaskProvider).on(
        'accountsChanged',
        (accounts: string[]) => {
          clear()
          console.log(`MetaMask accounts changed: ${accounts}`)
        },
      )
      break
    case 'walletconnect':
      ;(provider.value as WalletConnectProvider).on(
        'accountsChanged',
        (accounts: string[]) => {
          clear()
          console.log(`WalletConnect accounts changed: ${accounts}`)
        },
      )
      break
  }
}

function subscribeChainChanged() {
  switch (walletName.value) {
    case 'metamask':
      ;(provider.value as MetaMaskProvider).on(
        'chainChanged',
        (chainId: number) => {
          clear()
          console.log(`MetaMask chain changed: ${chainId}`)
        },
      )
      break
    case 'walletconnect':
      ;(provider.value as WalletConnectProvider).on(
        'chainChanged',
        (chainId: number) => {
          clear()
          console.log(`WalletConnect chain changed: ${chainId}`)
        },
      )
      break
  }
}
