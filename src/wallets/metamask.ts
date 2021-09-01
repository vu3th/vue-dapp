import detectEthereumProvider from '@metamask/detect-provider'
import { providers } from 'ethers'

export interface MetaMaskProvider extends providers.ExternalProvider {
  isMetaMask: boolean
  isConnected: () => boolean
  request: (request: {
    method: string
    params?: any[] | undefined
  }) => Promise<any>
  on: (event: string, callback: (param: any) => void) => void
}

export interface MetaMaskProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export default class Metamask {
  static async check(): Promise<boolean> {
    // @todo try catch
    const provider = await detectEthereumProvider()
    return provider ? true : false
  }

  static async connect() {
    const provider = (await detectEthereumProvider()) as MetaMaskProvider

    // await provider.request({
    //   method: 'wallet_requestPermissions',
    //   params: [{ eth_accounts: {} }],
    // })
    await provider.request({
      method: 'eth_requestAccounts',
      params: [{ eth_accounts: {} }],
    })

    return provider
  }
}
