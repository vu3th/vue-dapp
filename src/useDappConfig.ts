import { reactive } from 'vue-demi'
import { Wallet } from './constants'

export type DappConfigs = {
  appChainId?: number
  supportedChainIds?: number[]
  supportedWallets?: Wallet[]
  infuraAPI?: string
}

const dappConfigs = reactive({
  appChainId: 0,
  supportedChainIds: <number[]>[],
  supportedWallets: [Wallet.metamask],
  infuraAPI: '',
})

export function useDappConfig() {
  function setConfig({ ...options }: DappConfigs) {
    dappConfigs.appChainId = options.appChainId || 0
    dappConfigs.supportedChainIds = options.supportedChainIds || <number[]>[]
    dappConfigs.supportedWallets = options.supportedWallets || [Wallet.metamask]
    dappConfigs.infuraAPI = options.infuraAPI || ''
  }

  return {
    dappConfigs,
    setConfig,
  }
}
