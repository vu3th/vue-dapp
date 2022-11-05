import { Connector } from './connector'
import type WalletConnectProvider from '@walletconnect/web3-provider'
import { getAddress, hexValue } from 'ethers/lib/utils'
import {
  ProviderNotFoundError,
  ProviderRpcError,
  SwitchChainError,
  SwitchChainNotSupportedError,
  UserRejectedRequestError,
} from './errors'

/**
 * WalletConnect v1.0 \
 * Docs: https://docs.walletconnect.com/quick-start/dapps/web3-provider \
 * Test Wallet: https://test.walletconnect.org/ \
 * Source: https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts
 */
export interface IWalletConnectProvider extends WalletConnectProvider {}

export type WalletConnectOptions = ConstructorParameters<
  typeof WalletConnectProvider
>[0]

export class WalletConnectConnector extends Connector<
  WalletConnectProvider,
  WalletConnectOptions
> {
  readonly name = 'walletConnect'

  #provider?: WalletConnectProvider
  #onDisconnectHandler?: (code: number, reason: string) => void
  #onAccountsChangedHandler?: (accounts: string[]) => void
  #onChainChangedHandler?: (chainId: number) => void

  constructor(options: WalletConnectOptions) {
    super(options)
  }

  async connect() {
    const provider = await this.getProvider()
    this.#provider = provider
    const accounts = await provider.enable()
    const account = getAddress(accounts[0])

    return {
      account,
      provider,
    }
  }

  async getProvider() {
    const WalletConnectProvider = (await import('@walletconnect/web3-provider'))
      .default
    const provider = new WalletConnectProvider({
      ...this.options,
    })

    // fix: If user reject session, provider.enable() will be stuck and can't be resolved.
    // source code: https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts
    return new Promise<WalletConnectProvider>(async (resolve, reject) => {
      provider.wc.on('disconnect', (err, payload) => {
        if (!provider.connected) {
          console.error(err, payload)
          reject(new UserRejectedRequestError(err))
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

  async disconnect() {
    if (!this.#provider) throw new ProviderNotFoundError()
    await this.#provider.disconnect()
    this.#provider = undefined
  }

  onDisconnect(handler: (code: number, reason: string) => void) {
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
    this.#provider.on('chainChanged', (chainId: number) => {
      if (this.options?.rpc && this.options.rpc[chainId]) {
        handler(chainId)
      } else {
        // TODO: what's the best way to handle this?
        this.disconnect()
        window.location.reload()
        throw new Error('chain id not supported by connector')
      }
    })
  }

  #removeListener(event: string, handler: (...args: any[]) => void) {
    if (!this.#provider) throw new ProviderNotFoundError()
    this.#provider.removeListener(event, handler)
    // console.log('remove listener', event, handler)
  }

  /**
   * @error Not support for WalletConnect v1.0
   */
  async switchChain(chainId: number) {
    if (!this.#provider) throw new ProviderNotFoundError()
    if (!this.options?.rpc?.[chainId]) throw new SwitchChainNotSupportedError()

    const id = hexValue(chainId)

    try {
      await this.#provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: id }],
      })
    } catch (error: unknown) {
      const message =
        typeof error === 'string' ? error : (<ProviderRpcError>error)?.message
      if (/user rejected request/i.test(message)) {
        throw new UserRejectedRequestError(error)
      }
      throw new SwitchChainError(error)
    }
  }
}
