import { reactive, markRaw } from 'vue'
import { providers } from 'ethers'
import { Connector } from '../wallets'
import { useEthers } from './useEthers'

export type ConnectionStatus = 'none' | 'connecting' | 'loading' | 'connected'

const wallet = reactive({
  connector: null as Connector | null,
  provider: null as providers.ExternalProvider | null,
  error: '',
  status: 'none' as ConnectionStatus,
})

export type OnDisconnectCallback = (...args: any[]) => void
export type OnAccountsChangedCallback = (accounts: string[]) => void
export type OnChainChangedCallback = (chainId: number) => void

const callbacks = reactive({
  onDisconnectCallback: null as OnDisconnectCallback | null,
  onAccountsChangedCallback: null as OnAccountsChangedCallback | null,
  onChainChangedCallback: null as OnChainChangedCallback | null,
})

export type useWalletOptions = {
  useEthers: boolean
}

export function useWallet(options: useWalletOptions = { useEthers: true }) {
  const clearWallet = () => {
    wallet.connector = null
    wallet.provider = null
    wallet.error = ''
    wallet.status = 'none'

    if (options.useEthers) {
      const { deactivate } = useEthers()
      deactivate()
    }
  }

  async function reactivate() {
    const { activate } = useEthers()
    wallet.status = 'loading'
    try {
      await activate(wallet.provider!)
    } catch (err: any) {
      clearWallet()
      wallet.error = err.message
      throw new Error(err)
    }
    wallet.status = 'connected'
  }

  async function connectWith(connector: Connector) {
    wallet.status = 'connecting'
    wallet.error = ''

    try {
      if (!connector) throw new Error('Incorrect connector argument')

      const { provider } = await connector.connect()

      wallet.connector = markRaw(connector)
      wallet.provider = markRaw(provider)

      if (options.useEthers) {
        wallet.status = 'loading'
        const { activate } = useEthers()
        await activate(wallet.provider!)
      }
    } catch (err: any) {
      clearWallet()
      wallet.error = err.message
      throw new Error(err)
    }

    wallet.status = 'connected'

    // subscribe events
    if (wallet.connector) {
      wallet.connector.onDisconnect((...args: any[]) => {
        callbacks.onDisconnectCallback &&
          callbacks.onDisconnectCallback!(...args)
        /**
         * Exclude metamask to disconnect on this event
         * @note MetaMask disconnect event would be triggered when the specific chain changed (like L2 network),
         * so if we disconnect in this case, it would fail to reactivate ethers when chain changed
         * because the wallet state was cleared.
         * @todo better solution
         */
        if (wallet.connector?.name === 'metaMask') {
          return
        }
        disconnect()
      })
    }

    if (wallet.connector) {
      wallet.connector.onAccountsChanged(async (accounts: string[]) => {
        callbacks.onAccountsChangedCallback &&
          callbacks.onAccountsChangedCallback!(accounts)
        if (options.useEthers) {
          await reactivate()
        }
      })
    }

    if (wallet.connector) {
      wallet.connector.onChainChanged(async (chainId: number) => {
        callbacks.onChainChangedCallback &&
          callbacks.onChainChangedCallback!(chainId)
        if (options.useEthers) {
          await reactivate()
        }
      })
    }
  }

  async function disconnect() {
    if (wallet.connector) {
      try {
        await wallet.connector.disconnect()
      } catch (err: any) {
        throw new Error(err)
      }
    }
    clearWallet()
  }

  function onDisconnect(callback: OnDisconnectCallback) {
    callbacks.onDisconnectCallback = callback
  }

  function onAccountsChanged(callback: OnAccountsChangedCallback) {
    callbacks.onAccountsChangedCallback = callback
  }

  function onChainChanged(callback: OnChainChangedCallback) {
    callbacks.onChainChangedCallback = callback
  }

  return {
    wallet,

    connectWith,
    disconnect,

    onDisconnect,
    onAccountsChanged,
    onChainChanged,
  }
}
