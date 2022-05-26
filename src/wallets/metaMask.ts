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
 * Docs: https://docs.metamask.io/guide/ethereum-provider.html
 * JSON RPC API: https://metamask.github.io/api-playground/api-documentation
 */
export interface MetaMaskProvider extends MetaMaskEthereumProvider {
  isMetaMask: boolean
  providers?: MetaMaskProvider[]
  isConnected: () => boolean
  request: (request: {
    method: string
    params?: any[] | undefined
  }) => Promise<any>
}

/**
 * source: @metamask/detect-provider
 * https://github.com/MetaMask/detect-provider/blob/main/src/index.ts
 */
export interface MetaMaskEthereumProvider {
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
  ethereum?: MetaMaskProvider
}

export type MetaMaskConnectorOptions = {
  appUrl?: string
}

export class MetaMaskConnector extends Connector<
  MetaMaskProvider,
  MetaMaskConnectorOptions
> {
  readonly name = 'metaMask'

  #provider?: MetaMaskProvider
  #onDisconnectHandler?: (error: ProviderRpcError) => void
  #onAccountsChangedHandler?: (accounts: string[]) => void
  #onChainChangedHandler?: (chainId: number) => void

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

    this.#provider = provider

    const accounts = await this.#provider.request({
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
  async disconnect() {
    if (!this.#provider) throw new ProviderNotFoundError()

    this.#onDisconnectHandler &&
      this.#removeListener('disconnect', this.#onDisconnectHandler)
    this.#onAccountsChangedHandler &&
      this.#removeListener('accountsChanged', this.#onAccountsChangedHandler)
    this.#onChainChangedHandler &&
      this.#removeListener('chainChanged', this.#onChainChangedHandler)

    this.#provider = undefined
    this.#onDisconnectHandler = undefined
    this.#onAccountsChangedHandler = undefined
    this.#onChainChangedHandler = undefined
  }

  /**
   * @note MetaMask disconnect event would be triggered when the specific chain changed (like L2 network),
   * and will not be triggered when a user clicked disconnect in wallet...
   */
  onDisconnect(handler: (error: ProviderRpcError) => void) {
    if (!this.#provider) throw new ProviderNotFoundError()
    if (this.#onDisconnectHandler) {
      this.#removeListener('disconnect', this.#onDisconnectHandler)
    }
    this.#onDisconnectHandler = handler
    this.#provider.on('disconnect', handler)
  }

  onAccountsChanged(handler: (accounts: string[]) => void) {
    if (!this.#provider) throw new ProviderNotFoundError()
    if (this.#onAccountsChangedHandler) {
      this.#removeListener('accountsChanged', this.#onAccountsChangedHandler)
    }
    this.#onAccountsChangedHandler = handler
    this.#provider.on('accountsChanged', handler)
  }

  onChainChanged(handler: (chainId: number) => void) {
    if (!this.#provider) throw new ProviderNotFoundError()
    if (this.#onChainChangedHandler) {
      this.#removeListener('chainChanged', this.#onChainChangedHandler)
    }
    this.#onChainChangedHandler = handler
    this.#provider.on('chainChanged', (chainId: string) => {
      const _chainId = this.#normalizeChainId(chainId)
      handler(_chainId)
    })
  }

  #removeListener(event: string, handler: (...args: any[]) => void) {
    if (!this.#provider) throw new ProviderNotFoundError()
    this.#provider.removeListener(event, handler)
  }

  #normalizeChainId(chainId: string | number) {
    if (typeof chainId === 'string')
      return Number.parseInt(
        chainId,
        chainId.trim().substring(0, 2) === '0x' ? 16 : 10,
      )
    return chainId
  }

  async switchChain(chainId: number) {
    if (!this.#provider) throw new ProviderNotFoundError()
    const id = hexValue(chainId)

    try {
      await this.#provider.request({
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
    if (!this.#provider) throw new ProviderNotFoundError()
    try {
      this.#provider.request({
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
