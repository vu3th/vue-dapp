import detectEthereumProvider from '@metamask/detect-provider'
import { providers } from 'ethers'
import { checkChainId } from '../utils'
import { NETWORK_DETAILS } from '../constants'

// Provider Docs: https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents
// JSON RPC API: https://metamask.github.io/api-playground/api-documentation

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

export class Metamask {
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

  static async switchChain(provider: MetaMaskProvider, chainId: number) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + chainId.toString(16) }], // chainId must be in hexadecimal numbers
      })
    } catch (err: any) {
      try {
        if (err.code === 4902 && checkChainId(chainId)) {
          await Metamask.addChain(
            provider,
            NETWORK_DETAILS[chainId as keyof typeof NETWORK_DETAILS],
          )
          return
        }
      } catch (err: any) {
        throw new Error(`Failed to add new chain: ${err.message}`)
      }
      throw new Error(`Failed to switch chain: ${err.message}`)
    }
  }

  static async addChain(
    provider: MetaMaskProvider,
    networkDetails: AddEthereumChainParameter,
  ) {
    return provider.request({
      method: 'wallet_addEthereumChain',
      params: [networkDetails], // chainId must be in hexadecimal numbers
    })
  }
}

// Refer to https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
export interface AddEthereumChainParameter {
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name?: string
    symbol: string // 2-6 characters long
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}
