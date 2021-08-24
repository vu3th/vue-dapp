// ref: https://github.com/johnnywang1994/vue-banque/blob/master/types/index.d.ts
// declare module '@walletconnect/web3-provider'

import { Ref, ComputedRef } from 'vue-demi'
import { Web3Provider, Network } from '@ethersproject/providers'
import { BigNumber, Signer } from 'ethers'
import { Wallet } from '../constants'

export interface WalletReturn {
  isConnected: Ref<boolean>
  provider: Ref<Web3Provider | null>
  connectError: Ref<string>

  signer: Ref<Signer | null>
  network: Ref<Network | null>
  address: Ref<string>
  balance: Ref<BigNumber>
  loadError: Ref<string>

  connect: (wallet: Wallet) => void
  disconnect: () => void
  updateBalance: () => void
  signTransaction: () => void
  signMessage: () => void
  signTypedData: () => void

  chainId: ComputedRef<number | undefined>
  error: ComputedRef<string | ''>

  fixedBalance: (fixed?: number) => string
}
