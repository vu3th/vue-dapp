import WalletLink, { WalletLinkProvider } from 'walletlink'

export { WalletLinkProvider }

export interface WalletLinkProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export class Walletlink {
  static async check() {
    if (!WalletLink) {
      console.warn('WalletLink unavailable')
      return false
    }
    return true
  }

  static async connect(infuraId: string, appName: string) {
    const walletLink = new WalletLink({ appName })
    const provider = walletLink.makeWeb3Provider(
      `https://mainnet.infura.io/v3/${infuraId}`,
    )

    return new Promise<WalletLinkProvider>(async (resolve, reject) => {
      provider.on('disconnect', (err, payload) => {
        if (!provider.connected) {
          console.log(err, payload)
          reject(new Error('User rejected the request.'))
        }
      })
      try {
        await provider.enable()
      } catch (e: any) {
        reject(new Error(e.message))
        return
      }
      resolve(provider)
    })
  }
}
