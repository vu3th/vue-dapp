import HttpConnection from './http-connection'

import {
  IRPCMap,
  IConnector,
  IJsonRpcResponseSuccess,
  IWalletConnectProviderOptions,
  IQRCodeModalOptions,
  IClientMeta,
} from './types'

export const ProviderEngine: any
export class WalletConnectProvider extends ProviderEngine {
  bridge: string
  qrcode: boolean
  qrcodeModal: {
    open: (
      uri: string,
      cb: any,
      qrcodeModalOptions?: IQRCodeModalOptions | undefined,
    ) => void
    close: () => void
  }
  qrcodeModalOptions: IQRCodeModalOptions | undefined
  rpc: IRPCMap | null
  infuraId: string
  http: HttpConnection | null
  wc: IConnector
  isConnecting: boolean
  connected: boolean
  connectCallbacks: any[]
  accounts: string[]
  chainId: number
  rpcUrl: string
  constructor(opts: IWalletConnectProviderOptions)
  get isWalletConnect(): boolean
  get connector(): IConnector
  get walletMeta(): IClientMeta | null
  enable: () => Promise<string[]>
  request: (payload: any) => Promise<any>
  send: (payload: any, callback?: any) => Promise<any>
  onConnect: (callback: any) => void
  triggerConnect: (result: any) => void
  disconnect(): Promise<void>
  close(): Promise<void>
  handleRequest(payload: any): Promise<any>
  handleOtherRequests(payload: any): Promise<IJsonRpcResponseSuccess>
  handleReadRequests(payload: any): Promise<IJsonRpcResponseSuccess>
  formatResponse(
    payload: any,
    result: any,
  ): {
    id: any
    jsonrpc: any
    result: any
  }
  getWalletConnector(opts?: {
    disableSessionCreation?: boolean
  }): Promise<IConnector>
  subscribeWalletConnector(): Promise<void>
  onDisconnect(): Promise<void>
  updateState(sessionParams: any): Promise<void>
  updateRpcUrl(chainId: number, rpcUrl?: string | undefined): void
  updateHttpConnection(): void
  sendAsyncPromise(method: string, params: any): Promise<any>
  initialize
  configWallet
}
