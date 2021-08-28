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

interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

// @todo useMetamask add options for adding event callback
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

    provider.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    provider.on('accountsChanged', (accounts) => {
      window.location.reload()
    })

    provider.on('disconnect', (error: ProviderRpcError) => {
      window.location.reload()
    })

    return provider
  }

  return {
    getProvider,
  }
}
