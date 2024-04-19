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

These two states will be frequently used in dapp development.

The `isConnected` is a [computed](https://vuejs.org/api/reactivity-core.html#computed), and the `wallet` is a [readonly](https://vuejs.org/api/reactivity-core.html#readonly) [reactive](https://vuejs.org/api/reactivity-core.html#reactive).

The types are defined [here](https://github.com/vu3th/vue-dapp/blob/main/packages/core/src/types/wallet.ts).

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

The wallet comprises 8 properties, each of which can be obtained from the `useVueDapp` as a [ref](https://vuejs.org/api/reactivity-core.html#ref).

```ts
const { error, chainId } = useVueDapp()

console.log(error.value)
console.log(chainId.value)
```







