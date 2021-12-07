import WalletConnectProvider from '@walletconnect/web3-provider'

// Test: https://test.walletconnect.org/
// Docs: https://docs.walletconnect.com/1.0/quick-start/dapps/web3-provider
// WalletConnectProvider source code: https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts

export { WalletConnectProvider }

export class Walletconnect {
  // @todo update check
  static async check() {
    if (!WalletConnectProvider) {
      console.warn(
        'Walletconnect unavailable: please add below script to enable the feature: <script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.6.5/dist/umd/index.min.js"></script>',
      )
      return false
    }
    return true
  }

  static async connect(infuraId: string, options?: any) {
    const provider = new WalletConnectProvider({
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
      try {
        await provider.enable()
      } catch (e: any) {
        reject(new Error(e))
        return
      }
      resolve(provider)
    })
  }
}
