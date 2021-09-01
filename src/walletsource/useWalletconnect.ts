import { WalletConnectProvider } from '../types/walletconnect'

declare global {
  interface Window {
    WalletConnectProvider?: {
      default: typeof WalletConnectProvider
    }
  }
}

export function useWalletconnect() {
  if (!window.WalletConnectProvider) {
    throw new Error(
      'Walletconnect unavailable: please add below script to enable the feature: <script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.6.5/dist/umd/index.min.js"></script>',
    )
  }

  const WalletConnectProviderDerived: typeof WalletConnectProvider =
    window.WalletConnectProvider.default

  async function getProvider() {
    if (!WalletConnectProviderDerived) return null
    const provider: WalletConnectProvider = new WalletConnectProviderDerived({
      infuraId: '27e484dcd9e3efcfd25a83a78777cdf1',
    })

    //  Enable session (triggers QR Code modal)
    await provider.enable()

    return provider
  }

  return {
    getProvider,
  }
}
