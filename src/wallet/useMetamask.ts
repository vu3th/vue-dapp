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

export function useMetamask() {
  async function getProvider() {
    const provider = (await detectEthereumProvider()) as MetaMaskProvider
    await provider.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    })
    await provider.request({
      method: 'eth_requestAccounts',
      params: [{ eth_accounts: {} }],
    })
    return provider
  }

  return {
    getProvider,
  }
}
