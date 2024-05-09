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


## Listeners

你有兩種方式可以監聽錢包的事件，若你要直接監聽 EIP-1193 的事件，可以使用以下函式，但需要注意的是，這三個函式最好在一個 app 中調用一次，若調用第二次會將之前的 callback 給覆蓋掉。

```ts
const { onDisconnect, onAccountsChanged, onChainChanged } = useVueDapp()

function onDisconnect(callback: (...args: any[]) => void): void
function onAccountsChanged(callback: (accounts: string[]) => void): void
function onChainChanged(callback: (chainId: number) => void): void
```

若你需要像 Vue.js 的 `watch` 一樣能夠在多個元件中調用，並且在元件 unmounted 後自動清除，那你可以使用下面的函式：

```ts
const { 
  watchConnected,
  watchAddressChanged,
  watchChainIdChanged,
  watchAddressChainIdChanged,
  watchWalletChanged,
  watchDisconnect,
} = useVueDapp()
```

最常被使用到的是 `watchWalletChanged`，當錢包連線時、地址更動時或網路更動時，都會觸發這個監聽器。

若使用 `immediate` 為 true，假設錢包早已在其他頁面連線了，它仍會在元件 mounted 的時候執行你的程式。例如使用者已經在首頁連線了，當他進入其他頁面時，需要立即執行某些程式，假設沒有使用 `immediate`，使用者切換到別頁時就不會觸發，因為錢包早已在上一個頁面連線了。

```ts
watchWalletChanged(() => {
  // exec...
})

watchWalletChanged(() => {
  // exec...
}, {
  immediate: true
})
```

上述用法的前提是你將 listener 放在路由層級的元件上（pages/, views/），若你將它們放在根元件（ex. app.vue, App.vue），則不需要 `immediate` 就能確保使用者連線時會執行你的程式，原因在於當根元件被載入時，使用者的錢包一定會從未連線轉換成已連線，不會有當元件載入時狀態就已經是 `connected` 的情況發生。
