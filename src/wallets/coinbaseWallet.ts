import { Connector } from './connector'
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
    const CoinbaseWalletSDK = (await import('@coinbase/wallet-sdk'))
      .CoinbaseWalletSDK
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
