---
description: ''
head:
  meta:
    - name: 'keywords'
      content: 'vue-dapp, overview'
---

# Overview

<a href="/images/overview.png" target="_blank"><img src="/images/overview.png" alt="overview" /></a>


## Wallet & isConnected

These two states will be frequently used in development.

The `isConnected` is a [computed](https://vuejs.org/api/reactivity-core.html#computed){:target="_blank"}, and the `wallet` is a [readonly](https://vuejs.org/api/reactivity-core.html#readonly) [reactive](https://vuejs.org/api/reactivity-core.html#reactive){:target="_blank"}.

The types are defined [here](https://github.com/vu3th/vue-dapp/blob/main/packages/core/src/types/wallet.ts){:target="_blank"}.

```ts
const { isConnected, wallet } = useVueDapp()

if(isConnected.value) {
  console.log(wallet.status) // 'idle' | 'connecting' | 'connected'
  console.log(wallet.error)
  console.log(wallet.connectorName)
  console.log(wallet.provider)
  console.log(wallet.connector)
  console.log(wallet.address)
  console.log(wallet.chainId)
  console.log(wallet.providerInfo) // EIP6963ProviderInfo | null
  console.log(wallet.providerTarget) // 'window.ethereum' | 'rdns' | null
}
```

The wallet comprises 9 properties, each of which can be obtained from the `useVueDapp` as a [computed](https://vuejs.org/api/reactivity-core.html#computed){:target="_blank"}.

```ts
const { error, chainId } = useVueDapp()

console.log(error.value)
console.log(chainId.value)
```

## Connect

The following explanation can help you better understand how `<VueDappModal>` connects to the wallet.

(If you're using `<VueDappModal>`, the following code snippet may not be necessary as `<VueDappModal>` handles this functionality for you. )

```ts
const { connectTo } = useVueDapp()
```

You can connect to a specific connector as follows:

```ts
connectTo("BrowserWallet", options)
connectTo("WalletConnect", undefined)
connectTo("CoinbaseWallet", undefined)
```

When connecting to a browser wallet, you have the option to use the RDNS specified in EIP-6963 for connection, or use the traditional `window.ethereum`.

```ts
export enum RdnsEnum {
	'rabby' = 'io.rabby',
	'metamask' = 'io.metamask',
	'brave' = 'com.brave.wallet',
	'coinbase' = 'com.coinbase.wallet',
	'bitget' = 'com.bitget.web3wallet',
}

export type RDNS = string
```

When a dapp is opened in a browser with wallet extensions installed, the provider can be obtained according to the EIP-6963. However, when the dapp is opened within a dapp browser built into a mobile wallet app, `window.ethereum` is used to obtain the provider.

```ts
connectTo("BrowserWallet", {
  target: "rdns",
  rdns: RdnsEnum.rabby
})

connectTo("BrowserWallet", {
  target: "window.ethereum",
})
```





