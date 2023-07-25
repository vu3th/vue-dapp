import { ref, reactive, markRaw } from 'vue'
import { ethers } from 'ethers'
import {
  AutoConnectError,
  ConnectError,
  Connector,
  ConnectorNotFoundError,
  isNotSafeApp,
  MetaMaskConnector,
  SafeConnector,
} from '../connectors'
import { useEthers } from './useEthers'

export type ConnectionStatus = 'none' | 'connecting' | 'loading' | 'connected'

const wallet = reactive({
  connector: null as Connector | null,
  provider: null as ethers.Eip1193Provider | null,
  error: '',
  status: 'none' as ConnectionStatus,
})

const persistDisconnect = ref(true)
const dumb = ref(true)

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
      if (wallet.provider) {
        await activate(wallet.provider!)
        wallet.status = 'connected'
      } else {
        wallet.status = 'none'
      }
    } catch (err: any) {
      clearWallet()
      wallet.error = err.message
      throw new Error(err)
    }
  }

  async function connectWith(connector: Connector, timeout?: number) {
    wallet.error = ''
    wallet.status = 'connecting'

    // 1. connect wallet
    try {
      if (!connector) throw new ConnectorNotFoundError()

      const { provider } = await connector.connect(timeout)

      wallet.connector = markRaw(connector)
      wallet.provider = markRaw(provider)
    } catch (err: any) {
      await disconnect() // will also clearWallet()
      wallet.error = err.message
      throw new ConnectError(err)
    }

    wallet.status = 'loading'

    // 2. activate ethers
    try {
      if (options.useEthers) {
        const { activate } = useEthers()
        await activate(wallet.provider!)
      }
    } catch (err: any) {
      await disconnect() // will also clearWallet()
      wallet.error = err.message
      throw new ConnectError(err)
    }

    wallet.status = 'connected'
    localStorage.removeItem('VUE_DAPP__hasDisconnected')

    // 3. subscribe events
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
        clearWallet()
        throw new Error(err)
      }
    }
    clearWallet()
    persistDisconnect.value &&
      localStorage.setItem('VUE_DAPP__hasDisconnected', 'true')
  }

  async function autoConnect(connectors: Connector[]) {
    if (
      persistDisconnect.value &&
      localStorage.getItem('VUE_DAPP__hasDisconnected')
    ) {
      !dumb.value && console.warn('No auto-connect: has disconnected') // eslint-disable-line
      return
    }
    // try auto-connect to safe
    const safe = connectors.find((conn) => conn.name === 'safe') as
      | SafeConnector
      | undefined

    if (!!safe && !isNotSafeApp()) {
      try {
        const isSafeApp = await safe.isSafeApp()
        if (isSafeApp) {
          await connectWith(safe)
        } else if (!dumb.value) {
          // prettier-ignore
          console.warn(  // eslint-disable-line
            'No auto-connect to Safe: not safe app from safe.isSafeApp()',
          )
        }
      } catch (err: any) {
        throw new Error('Failed to connect Gnosis Safe') // let keep processing the following code
      }
    } else if (!dumb.value) {
      if (!safe) {
        console.warn('No auto-connect to Safe: connector not found') // eslint-disable-line
      } else if (isNotSafeApp()) {
        // prettier-ignore
        console.warn(   // eslint-disable-line
          'No auto-connect to Safe: not safe app from isNotSafeApp()',
        )
      } else {
        console.warn('No auto-connect to Safe') // eslint-disable-line
      }
    }

    if (wallet.status !== 'none') {
      return
    }

    // try auto-connect to metamask
    const metamask = connectors.find((conn) => conn.name === 'metaMask') as
      | MetaMaskConnector
      | undefined

    if (metamask) {
      try {
        const isConnected = await MetaMaskConnector.checkConnection()
        if (isConnected) {
          await connectWith(metamask)
        } else if (!dumb.value) {
          console.warn('No auto-connect to MetaMask: not connected') // eslint-disable-line
        }
      } catch (err: any) {
        throw new AutoConnectError(err)
      }
    } else if (!dumb.value) {
      console.warn('No auto-connect to MetaMask: connector not found') // eslint-disable-line
    }
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
    persistDisconnect,
    dumb,

    connectWith,
    disconnect,
    autoConnect,

    onDisconnect,
    onAccountsChanged,
    onChainChanged,
  }
}
