import { Connector } from './connector'
import { getAddress, hexValue } from 'ethers/lib/utils'
import {
  ProviderNotFoundError,
  ProviderRpcError,
  SwitchChainError,
  SwitchChainNotSupportedError,
  UserRejectedRequestError,
} from './errors'
import { EthereumProviderOptions } from '@walletconnect/ethereum-provider/dist/types/EthereumProvider'

export class WalletConnectConnector extends Connector {
  readonly name = 'walletConnect'
  #provider?: any
  #onDisconnectHandler?: (code: number, reason: string) => void
  #onAccountsChangedHandler?: (accounts: string[]) => void
  #onChainChangedHandler?: (chainId: number) => void

  constructor(options: EthereumProviderOptions) {
    super(options)
  }

  async connect() {
    const provider: any = await this.getProvider()
    this.#provider = provider
    const accounts = await provider.enable()
    const account = getAddress(accounts[0])

    return {
      account,
      provider,
    }
  }

  async getProvider() {
    const { EthereumProvider } = await import(
      '@walletconnect/ethereum-provider'
    )
    const provider = await EthereumProvider.init({
      ...this.options,
    })

    return new Promise<typeof EthereumProvider>(async (resolve, reject) => {
      provider.on('disconnect', (args: any) => {
        if (!provider.connected) {
          reject(new UserRejectedRequestError(args.message))
        }
      })
      try {
        await provider.enable()
      } catch (e: any) {
        reject(new Error(e))
        return
      }
      resolve(provider as any)
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
