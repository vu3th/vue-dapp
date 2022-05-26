import { Connector } from './connector'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import type { CoinbaseWalletProvider } from '@coinbase/wallet-sdk'
import type { CoinbaseWalletSDKOptions } from '@coinbase/wallet-sdk/dist/CoinbaseWalletSDK'
import { getAddress, hexValue } from 'ethers/lib/utils'
import {
  AddChainError,
  ProviderNotFoundError,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
} from './errors'

/**
 * Coinbase Wallet SDK
 * Docs: https://docs.cloud.coinbase.com/wallet-sdk/docs/
 */
export interface ICoinbaseWalletProvider extends CoinbaseWalletProvider {}

export type CoinbaseWalletConnectorOptions = CoinbaseWalletSDKOptions & {
  jsonRpcUrl: string
  chainId?: number
}

export class CoinbaseWalletConnector extends Connector<
  CoinbaseWalletProvider,
  CoinbaseWalletConnectorOptions
> {
  readonly name = 'coinbaseWallet'

  #provider?: CoinbaseWalletProvider
  #onDisconnectHandler?: () => void
  #onAccountsChangedHandler?: (accounts: string[]) => void
  #onChainChangedHandler?: (chainId: number) => void

  constructor(options: CoinbaseWalletConnectorOptions) {
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
    const client = new CoinbaseWalletSDK(this.options)
    const provider = client.makeWeb3Provider(
      this.options.jsonRpcUrl,
      this.options.chainId,
    )
    return provider
  }

  async disconnect() {
    if (!this.#provider) throw new ProviderNotFoundError()
    await this.#provider.close()
    this.#provider = undefined
  }

  /**
   * @note CoinbaseWallet will reload page if it disconnected by wallet app.
   * @todo experiment with the browser extension
   */
  onDisconnect(handler: () => void) {
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
    this.#provider.on('chainChanged', handler)
  }

  #removeListener(event: string, handler: (...args: any[]) => void) {
    if (!this.#provider) throw new ProviderNotFoundError()
    this.#provider.removeListener(event, handler)
    // console.log('remove listener', event, handler)
  }

  /**
   * @todo: add addChain()
   */
  async switchChain(chainId: number) {
    if (!this.#provider) throw new ProviderNotFoundError()
    const provider = this.#provider
    const id = hexValue(chainId)

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: id }],
      })
    } catch (error: unknown) {
      if ((<ProviderRpcError>error).code === 4902) {
        try {
          // await provider.request({
          //   method: 'wallet_addEthereumChain',
          //   params: [
          //     {
          //       chainId: id,
          //       chainName: chain.name,
          //       nativeCurrency: chain.nativeCurrency,
          //       rpcUrls: [chain.rpcUrls.default],
          //       blockExplorerUrls: this.getBlockExplorerUrls(chain),
          //     },
          //   ],
          // })
        } catch (addError: unknown) {
          if (this.#isUserRejectedRequestError(addError)) {
            throw new UserRejectedRequestError(addError)
          }
          throw new AddChainError()
        }
      }

      if (this.#isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error)
      }
      throw new SwitchChainError(error)
    }
  }

  #isUserRejectedRequestError(error: unknown) {
    return /(user rejected)/i.test((<Error>error).message)
  }
}
