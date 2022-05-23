import { providers } from 'ethers'
import { hexValue } from 'ethers/lib/utils'
import { NETWORK_DETAILS } from '../constants'
import { Connector } from './connector'
import {
  AddChainError,
  ProviderRpcError,
  ProviderNotFoundError,
  UserRejectedRequestError,
  SwitchChainError,
} from './errors'

/**
 * MetaMask
 * Docs: https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents
 * JSON RPC API: https://metamask.github.io/api-playground/api-documentation
 */

/**
 * source: @metamask/detect-provider
 * https://github.com/MetaMask/detect-provider/blob/main/src/index.ts
 */
interface MetaMaskEthereumProvider {
  isMetaMask?: boolean
  once(eventName: string | symbol, listener: (...args: any[]) => void): this
  on(eventName: string | symbol, listener: (...args: any[]) => void): this
  off(eventName: string | symbol, listener: (...args: any[]) => void): this
  addListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void,
  ): this
  removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void,
  ): this
  removeAllListeners(event?: string | symbol): this
}

export interface Window {
  ethereum?: MetaMaskEthereumProvider
}

export interface MetaMaskProvider extends providers.ExternalProvider {
  isMetaMask: boolean
  providers?: MetaMaskProvider[]
  isConnected: () => boolean
  request: (request: {
    method: string
    params?: any[] | undefined
  }) => Promise<any>
  on: (event: string, callback: (param: any) => void) => void
}

export type MetaMaskConnectorOptions = {
  appUrl?: string
}

export class MetaMaskConnector extends Connector<
  MetaMaskProvider,
  MetaMaskConnectorOptions
> {
  readonly name = 'metaMask'

  constructor(options: MetaMaskConnectorOptions = {}) {
    super(options)
  }

  async connect() {
    let provider = await this.getProvider()

    /**
     * See PR #36 - find the single metamask provider when coinbaseWallet & metaMask are both installed
     * @link https://github.com/chnejohnson/vue-dapp/pull/36
     */
    const isMulti = (provider?.providers?.length || 0) > 1
    isMulti &&
      (provider =
        provider?.providers?.find((e: MetaMaskProvider) => e.isMetaMask) ||
        provider)

    const accounts = await provider.request({
      method: 'eth_requestAccounts',
      params: [{ eth_accounts: {} }],
    })
    const account = accounts[0]
    return {
      account,
      provider,
    }
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.ethereum) {
      return window.ethereum as MetaMaskProvider
    }
    /**
     * @see PR#29 - add deep link to MetaMask wallet on mobile device
     * @link https://github.com/chnejohnson/vue-dapp/pull/29
     */
    if (this.options.appUrl) {
      window.open(
        `https://metamask.app.link/dapp/${this.options.appUrl}`,
        '_blank',
      )
    }
    throw new ProviderNotFoundError()
  }

  /**
   * MetaMask do not support programmatic disconnect.
   * @see https://github.com/MetaMask/metamask-extension/issues/10353
   */
  async disconnect() {}

  async switchChain(chainId: number) {
    const provider = await this.getProvider()
    const id = hexValue(chainId)

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: id }],
      })
    } catch (err: unknown) {
      if ((<ProviderRpcError>err).code === 4902) {
        try {
          await this.addChain(
            NETWORK_DETAILS[chainId as keyof typeof NETWORK_DETAILS],
          )
        } catch (err: unknown) {
          if (this.#isUserRejectedRequestError(err)) {
            throw new UserRejectedRequestError(err)
          }
          throw new AddChainError()
        }
      }
      if (this.#isUserRejectedRequestError(err)) {
        throw new UserRejectedRequestError(err)
      }
      throw new SwitchChainError(err)
    }
  }

  async addChain(networkDetails: AddEthereumChainParameter) {
    const provider = await this.getProvider()
    try {
      provider.request({
        method: 'wallet_addEthereumChain',
        params: [networkDetails], // notice that chainId must be in hexadecimal numbers
      })
    } catch (err: unknown) {
      throw new AddChainError()
    }
  }

  #isUserRejectedRequestError(error: unknown) {
    return /(user rejected)/i.test((<Error>error).message)
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
