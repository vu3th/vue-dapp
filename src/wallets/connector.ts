import { providers } from 'ethers'

export type ConnectorData<Provider = any> = {
  account: string
  provider: Provider
}

export abstract class Connector<
  Provider = providers.ExternalProvider,
  Options = any,
> {
  // Connector name
  abstract readonly name: string
  // Options to pass to the third-party provider
  readonly options: Options

  constructor(options: Options) {
    this.options = options
  }

  abstract connect(): Promise<Required<ConnectorData>>
  abstract getProvider(): Promise<Provider>
  abstract disconnect(): Promise<void>
  abstract onDisconnect(handler: (...args: any[]) => any): void
  abstract onAccountsChanged(handler: (accounts: string[]) => any): void
  abstract onChainChanged(handler: (chainId: number) => any): void
  abstract switchChain(chainId: number): Promise<void>
}
