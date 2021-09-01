import { IWalletConnectProviderOptions } from '../types/walletconnect/types'
import { WalletConnectProvider } from '../types/walletconnect'

// Test: https://test.walletconnect.org/

declare global {
  interface Window {
    WalletConnectProvider?: {
      default: typeof WalletConnectProvider
    }
  }
}

const WalletConnectProviderDerived: typeof WalletConnectProvider | undefined =
  window.WalletConnectProvider?.default

export default class Walletconnect {
  static async check(infuraId: string) {
    if (!WalletConnectProviderDerived) {
      console.warn(
        'Walletconnect unavailable: please add below script to enable the feature: <script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.6.5/dist/umd/index.min.js"></script>',
      )
      return false
    }

    try {
      const res = await fetch(`https://mainnet.infura.io/v3/${infuraId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_blockNumber',
          params: [],
        }),
      })
      const data = await res.json()
      console.log(data)
    } catch (e) {
      console.warn(
        'Walletconnect unavailable: please check if your infura ID is valid.',
      )
      return false
    }

    return true
  }
  static async connect(
    infuraId: string,
    options?: IWalletConnectProviderOptions,
  ) {
    const provider = new WalletConnectProviderDerived!({
      infuraId,
      ...options,
    })

    await provider.enable()
    provider.qrcodeModal.close()

    return provider
  }
}
