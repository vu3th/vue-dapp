import { Connector } from './connector'
import type WalletConnectProvider from '@walletconnect/web3-provider'
import { getAddress, hexValue } from 'ethers/lib/utils'
import {
  ProviderNotFoundError,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
} from './errors'

export type WalletConnectOptions = ConstructorParameters<
  typeof WalletConnectProvider
>[0]

/**
 * WalletConnect v1.0 \
 * Docs: https://docs.walletconnect.com/quick-start/dapps/web3-provider \
 * Test Wallet: https://test.walletconnect.org/ \
 * Source: https://github.com/WalletConnect/walletconnect-monorepo/blob/v1.0/packages/providers/web3-provider/src/index.ts
 */
export class WalletConnectConnector extends Connector<
  WalletConnectProvider,
  WalletConnectOptions
> {
  readonly name = 'walletConnect'

  #provider?: WalletConnectProvider

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
          console.log(err, payload)
          reject(new Error('User rejected the request.'))
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
  }

  /**
   * @error Not support for WalletConnect v1.0
   */
  async switchChain(chainId: number) {
    if (!this.#provider) throw new ProviderNotFoundError()
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
