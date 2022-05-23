import { ref, reactive, markRaw } from 'vue'
import { Connector } from '../wallets/connector'
import { useEthers } from './useEthers'

export type ConnectionStatus = 'none' | 'connecting' | 'loading' | 'connected'

const wallet = reactive({
  connector: null as Connector | null,
  account: '',
  provider: null as any,
  error: '',
  status: 'none' as ConnectionStatus,
})

export type OnDisconnectCallback = (msg: string) => void
const onDisconnectCallback = ref<OnDisconnectCallback | null>(null)

export type useWalletOptions = {
  useEthers: boolean
}

export function useWallet(options: useWalletOptions = { useEthers: true }) {
  const clearWallet = () => {
    wallet.connector = null
    wallet.account = ''
    wallet.provider = null
    wallet.error = ''
    wallet.status = 'none'

    onDisconnectCallback.value = null

    if (options.useEthers) {
      const { deactivate } = useEthers()
      deactivate()
    }
  }

  async function connectWith(connector: Connector) {
    wallet.status = 'connecting'
    wallet.error = ''

    try {
      if (!connector) throw new Error('Incorrect connector argument')

      const { account, provider } = await connector.connect()

      wallet.connector = markRaw(connector)
      wallet.provider = markRaw(provider)
      wallet.account = account

      if (options.useEthers) {
        wallet.status = 'loading'
        const { activate } = useEthers()
        await activate(wallet.provider)
      }
    } catch (err: any) {
      clearWallet()
      wallet.error = err.message
      throw new Error(err)
    }

    wallet.status = 'connected'
  }

  // Note that this is to disconnect from website instead of wallet.
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

  // function subscribeDisconnect() {}

  function onDisconnect(callback: OnDisconnectCallback) {
    onDisconnectCallback.value = callback
  }

  return {
    wallet,

    connectWith,
    disconnect,

    onDisconnect,
  }
}
