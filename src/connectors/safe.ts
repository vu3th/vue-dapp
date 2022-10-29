import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import SafeAppsSDK, {
  Opts as SafeOpts,
  SafeInfo,
} from '@gnosis.pm/safe-apps-sdk'
import { getAddress } from 'ethers/lib/utils'
import { normalizeChainId } from '../utils'
import { Connector } from './connector'
import {
  ConnectorNotFoundError,
  ProviderNotFoundError,
  ProviderRpcError,
} from './errors'

const __IS_SERVER__ = typeof window === 'undefined'
const __IS_IFRAME__ = !__IS_SERVER__ && window?.parent !== window

export class SafeConnector extends Connector<SafeAppProvider, SafeOpts> {
  readonly name = 'safe'
  ready = !__IS_SERVER__ && __IS_IFRAME__

  #provider?: SafeAppProvider
  #sdk: SafeAppsSDK
  #safe?: SafeInfo

  #onDisconnectHandler?: (error: ProviderRpcError) => void
  #onAccountsChangedHandler?: (accounts: string[]) => void
  #onChainChangedHandler?: (chainId: number) => void

  constructor(options: SafeOpts = {}) {
    super(options)
    this.#sdk = new SafeAppsSDK(options)
  }

  async connect() {
    const runningAsSafeApp = await this.isSafeApp()
    if (!runningAsSafeApp) {
      throw new ConnectorNotFoundError()
    }

    const provider = await this.getProvider()

    if (!this.#safe) {
      throw new ConnectorNotFoundError()
    }
    getAddress(this.#safe.safeAddress)

    const account = await getAddress(this.#safe.safeAddress)

    return {
      account,
      provider,
    }
  }

  async getProvider() {
    if (!this.#provider) {
      const safe = await this.#getSafeInfo()
      if (!safe) {
        throw new Error('Could not load Safe information')
      }

      this.#provider = new SafeAppProvider(safe, this.#sdk)
    }
    return this.#provider
  }

  async isSafeApp(): Promise<boolean> {
    if (!this.ready) {
      return false
    }

    const safe = await Promise.race([
      this.#getSafeInfo(),
      new Promise<void>((resolve) => setTimeout(resolve, 300)),
    ])
    return !!safe
  }

  async #getSafeInfo(): Promise<SafeInfo> {
    if (!this.#sdk) {
      throw new ConnectorNotFoundError()
    }
    if (!this.#safe) {
      this.#safe = await this.#sdk.safe.getInfo()
    }
    return this.#safe
  }

  async disconnect() {
    if (!this.#provider) throw new ProviderNotFoundError()

    this.#onDisconnectHandler &&
      this.#removeListener('disconnect', this.#onDisconnectHandler)
    this.#onAccountsChangedHandler &&
      this.#removeListener('accountsChanged', this.#onAccountsChangedHandler)
    this.#onChainChangedHandler &&
      this.#removeListener('chainChanged', this.#onChainChangedHandler)

    this.#provider = undefined
    this.#safe = undefined

    this.#onDisconnectHandler = undefined
    this.#onAccountsChangedHandler = undefined
    this.#onChainChangedHandler = undefined
  }

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
      const _chainId = normalizeChainId(chainId)
      handler(_chainId)
    })
  }
  #removeListener(event: string, handler: (...args: any[]) => void) {
    if (!this.#provider) throw new ProviderNotFoundError()
    this.#provider.removeListener(event, handler)
  }
}
