import { ChainId } from '../constants'

export type RpcUrls = {
  [chainId: number]: string
}

export type MulticallAddresses = {
  [chainId: number]: string
}

export type Config = {
  appChainId?: ChainId
  infuraId?: string
  rpcUrls?: RpcUrls
  multicallAddresses?: MulticallAddresses
  supportedChains: number[]
  pollingInterval?: number
  // notifications: {
  //   checkInterval: number
  //   expirationPeriod: number
  // }
}
