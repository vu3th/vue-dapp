---
description: ''
head:
  meta:
    - name: 'keywords'
      content: 'vue-dapp, overview'
---

# 概覽

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
  console.log(wallet.providerInfo) // see EIP-6963
  console.log(wallet.connector)
  console.log(wallet.address)
  console.log(wallet.chainId)
}
```

The wallet comprises 8 properties, each of which can be obtained from the `useVueDapp` as a [computed](https://vuejs.org/api/reactivity-core.html#computed){:target="_blank"}.

```ts
const { error, chainId } = useVueDapp()

console.log(error.value)
console.log(chainId.value)
```

## Connect

若你使用 `<VueDappModal>`，下方的程式碼你不太會用到，`<VueDappModal>` 已經幫你把這部分的功能處理好了，以下的說明可以幫助你更了解 Vue Dapp。

```ts
const { connectTo } = useVueDapp()
```

你可以針對特定 connector 進行連線。

```ts
connectTo("BrowserWallet", options)
connectTo("WalletConnect", undefined)
connectTo("CoinbaseWallet", undefined)
```

當你要連線到瀏覽器錢包時，可以選擇使用 EIP-6963 的 RDNS 來連線，或者使用傳統的 `window.ethereum`。

當 dapp 在安裝錢包外掛的瀏覽器上開啟時，可以根據 EIP-6963 的協議來取得 provider。而當 dapp 在手機錢包 app 內建的 dapp 瀏覽器上開啟時，則使用 `window.ethereum` 來取得 provider。

```ts
connectTo("BrowserWallet", {
  target: "rdns",
  rdns: "io.rabby"
})

connectTo("BrowserWallet", {
  target: "window.ethereum",
})
```
