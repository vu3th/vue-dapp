import WalletConnectProvider from '@walletconnect/web3-provider'
import { checkInfuraId } from '../utils'

// Test: https://test.walletconnect.org/
// Docs: https://docs.walletconnect.com/1.0/quick-start/dapps/web3-provider
// WalletConnectProvider source code: https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts

export { WalletConnectProvider }

export class Walletconnect {
  static async check(infuraId: string) {
    if (!WalletConnectProvider) {
      return false
    }

    const res = await checkInfuraId(infuraId)
    if (!res) {
      console.warn('Invalid Infura ID for WalletConnect')
      return false
    }

    return true
  }

  // Refer to https://docs.walletconnect.com/quick-start/dapps/web3-provider#provider-options
  static async connect(providerOptions: any) {
    const provider = new WalletConnectProvider({
      ...providerOptions,
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
