import { DeepReadonly, reactive, readonly, ref } from 'vue-demi'
import { Wallet } from './constants'

const appChainId = ref(0)

const defaultConfigs = reactive({
  supportedChainIds: <number[]>[],
  supportedWallets: [Wallet.metamask],
})

let configs: DeepReadonly<Configs>

type Configs = {
  supportedChainIds: number[]
  supportedWallets: Wallet[]
}

export function useDappConfig() {
  function initConfig({ ...options }: Configs) {
    defaultConfigs.supportedChainIds = options.supportedChainIds
    defaultConfigs.supportedWallets = options.supportedWallets
    configs = readonly(defaultConfigs)
  }

  return {
    appChainId,
    configs,
    initConfig,
    updateAppChainId,
  }
}

// mutations
function updateAppChainId(chainId: number) {
  appChainId.value = chainId
  return appChainId
}
