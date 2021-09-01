import { useDappConfig } from '../useDappConfig'
import { WalletConnectProvider } from '../types/walletconnect'

// Test: https://test.walletconnect.org/

declare global {
  interface Window {
    WalletConnectProvider?: {
      default: typeof WalletConnectProvider
    }
  }
}

let provider: WalletConnectProvider

const { dappConfigs } = useDappConfig()

export function useWalletconnect() {
  if (!window.WalletConnectProvider) {
    throw new Error(
      'Walletconnect unavailable: please add below script to enable the feature: <script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.6.5/dist/umd/index.min.js"></script>',
    )
  } else if (!dappConfigs.infuraAPI) {
    throw new Error(
      'Walletconnect unavailable: please set infuraAPI with useDappConfig or app.use(VueDapp, { infuraAPI: <your-infura-api> })',
    )
  }

  const WalletConnectProviderDerived: typeof WalletConnectProvider =
    window.WalletConnectProvider.default

  async function getProvider() {
    provider = new WalletConnectProviderDerived({
      infuraId: dappConfigs.infuraAPI,
    })

    //  Enable session (triggers QR Code modal)
    await provider.enable()

    return provider
  }

  async function disconnect() {
    if (provider) {
      await provider.disconnect()
    }
  }

  return {
    getProvider,
    disconnect,
  }
}
