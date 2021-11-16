import { ref, markRaw, computed, Ref } from 'vue'
import Metamask, {
  MetaMaskProvider,
  MetaMaskProviderRpcError,
} from '../wallets/metamask'
import Walletconnect, { WalletConnectProvider } from '../wallets/walletconnect'
import Walletlink, {
  WalletLinkProvider,
  WalletLinkProviderRpcError,
} from '../wallets/walletlink'
import { useEthers } from './useEthers'

export type WalletProvider =
  | MetaMaskProvider
  | WalletConnectProvider
  | WalletLinkProvider
export type ConnectionState = 'none' | 'connecting' | 'connected'
export type WalletName = 'none' | 'metamask' | 'walletconnect' | 'walletlink'
export type OnConnectedCallback = (provider: WalletProvider) => void
export type OnDisconnectCallback = (msg: string) => void
export type OnAccountsChangedCallback = (accounts: string[]) => void
export type OnChainChangedCallback = (chainId: number) => void
export type UseWalletOptions = {
  library: 'ethers' | 'web3'
}

// ========================= state =========================

const provider = ref<WalletProvider | null>(null)
const status = ref<ConnectionState>('none')
const walletName = ref<WalletName>('none')
const error = ref('')

const onDisconnectCallback = ref<OnDisconnectCallback | null>(null)
const onAccountsChangedCallback = ref<OnAccountsChangedCallback | null>(null)
const onChainChangedCallback = ref<OnChainChangedCallback | null>(null)

export function useWallet(options: UseWalletOptions = { library: 'ethers' }) {
  const { activate, deactivate } = useEthers()

  function clear() {
    provider.value = null
    status.value = 'none'
    walletName.value = 'none'
    error.value = ''

    onDisconnectCallback.value = null
    onAccountsChangedCallback.value = null
    onChainChangedCallback.value = null

    options.library === 'ethers' && deactivate()
  }

  async function connect(
    _walletName: WalletName,
    infuraAPI?: string,
    appName?: string,
  ) {
    let _provider: WalletProvider | null = null

    error.value = ''

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
        case 'walletlink':
          if (!infuraAPI)
            throw new Error(
              'You should provide infuraAPI for connecting WalletLink',
            )
          if (!appName)
            throw new Error(
              'You should provide an app name for connecting WalletLink',
            )
          _provider = (await Walletlink.connect(
            infuraAPI,
            appName,
          )) as WalletLinkProvider
          if (!_provider.isConnected)
            throw new Error('walletlink is not connected')
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

    // EIP-1193 subscriber
    subscribeDisconnect()
    subscribeAccountsChanged()
    subscribeChainChanged()

    options.library === 'ethers' &&
      (await activate(provider.value as WalletProvider))
  }

  async function disconnect() {
    // note: metamask can't disconnect by provider
    if (walletName.value === 'walletconnect') {
      await (provider.value as WalletConnectProvider).disconnect()
    }
    clear()
    onDisconnectCallback.value &&
      onDisconnectCallback.value('Disconnect from Dapp')
  }

  // ========================= EIP-1193 subscriber =========================

  function subscribeDisconnect() {
    switch (walletName.value) {
      case 'metamask':
        ;(provider.value as MetaMaskProvider).on(
          'disconnect',
          (err: MetaMaskProviderRpcError) => {
            clear()
            onDisconnectCallback.value &&
              onDisconnectCallback.value(err.message)
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
            onDisconnectCallback.value &&
              onDisconnectCallback.value(`${code}: ${reason}`)
          },
        )
        break
      case 'walletlink':
        ;(provider.value as WalletLinkProvider).on(
          'disconnect',
          (err: WalletLinkProviderRpcError) => {
            clear()
            onDisconnectCallback.value &&
              onDisconnectCallback.value(err.message)
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
          async (accounts: string[]) => {
            options.library === 'ethers' &&
              (await activate(provider.value as WalletProvider))
            onAccountsChangedCallback.value &&
              onAccountsChangedCallback.value(accounts)
          },
        )
        break
      case 'walletconnect':
        ;(provider.value as WalletConnectProvider).on(
          'accountsChanged',
          async (accounts: string[]) => {
            options.library === 'ethers' &&
              (await activate(provider.value as WalletProvider))
            onAccountsChangedCallback.value &&
              onAccountsChangedCallback.value(accounts)
          },
        )
        break
      case 'walletlink':
        ;(provider.value as WalletLinkProvider).on(
          'accountsChanged',
          async (accounts: string[]) => {
            options.library === 'ethers' &&
              (await activate(provider.value as WalletProvider))
            onAccountsChangedCallback.value &&
              onAccountsChangedCallback.value(accounts)
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
          async (hexChainId: string) => {
            const chainId = parseInt(hexChainId, 16)
            options.library === 'ethers' &&
              (await activate(provider.value as WalletProvider))
            onChainChangedCallback.value &&
              onChainChangedCallback.value(chainId)
          },
        )
        break
      case 'walletconnect':
        ;(provider.value as WalletConnectProvider).on(
          'chainChanged',
          async (chainId: number) => {
            options.library === 'ethers' &&
              (await activate(provider.value as WalletProvider))
            onChainChangedCallback.value &&
              onChainChangedCallback.value(chainId)
          },
        )
        break
      case 'walletlink':
        ;(provider.value as WalletLinkProvider).on(
          'chainChanged',
          async (hexChainId: string) => {
            const chainId = parseInt(hexChainId, 16)
            options.library === 'ethers' &&
              (await activate(provider.value as WalletProvider))
            onChainChangedCallback.value &&
              onChainChangedCallback.value(chainId)
          },
        )
        break
    }
  }

  // ========================= callback =========================

  function onDisconnect(callback: OnDisconnectCallback) {
    onDisconnectCallback.value = callback
  }

  function onAccountsChanged(callback: OnAccountsChangedCallback) {
    onAccountsChangedCallback.value = callback
  }

  function onChainChanged(callback: OnChainChangedCallback) {
    onChainChangedCallback.value = callback
  }

  // ========================= getters =========================

  const isConnected = computed(() => {
    if (status.value === 'connected') return true
    else return false
  })

  return {
    // state
    provider: provider as Ref<WalletProvider | null>,
    status,
    walletName,
    error,

    // getters
    isConnected,

    // methods
    connect,
    disconnect,

    // callback
    onDisconnect,
    onAccountsChanged,
    onChainChanged,
  }
}
