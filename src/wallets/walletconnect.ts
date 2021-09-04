import { IWalletConnectProviderOptions } from '../types/walletconnect/types'
import { WalletConnectProvider } from '../types/walletconnect'

// Test: https://test.walletconnect.org/
// Docs: https://docs.walletconnect.org/quick-start/dapps/web3-provider
// WalletConnectProvider source code: https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts

declare global {
  interface Window {
    WalletConnectProvider?: {
      default: typeof WalletConnectProvider
    }
  }
}

const WalletConnectProviderDerived: typeof WalletConnectProvider | null =
  window.WalletConnectProvider?.default || null

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
      console.log('Infura ID is valid.', data)
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

    // fix: If user reject session, provider.enable() will be stuck and can't be resolved.
    // source code: https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts
    return new Promise<WalletConnectProvider>(async (resolve, reject) => {
      provider.wc.on('disconnect', (err, payload) => {
        if (!provider.connected) {
          console.log(err, payload)
          reject(new Error('User rejected the request.'))
        }
      })
      await provider.enable()
      resolve(provider)
    })
  }
}
