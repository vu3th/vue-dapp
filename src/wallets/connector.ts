export type ConnectorData<Provider = any> = {
  account: string
  provider: Provider
}

export abstract class Connector<Provider = any, Options = any> {
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
  abstract switchChain(chainId: number): Promise<void>
}
