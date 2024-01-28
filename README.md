<p align="center">
   <a href="https://vue-dapp.vercel.app/">
    <img src="https://github.com/vu3th/vue-dapp/blob/main/app/assets/logo.png" alt="VueDapp Logo" style="max-width:100%;" width="400">
  </a>
</p>
<h2 align="center">
  Vue Dapp
</h2>
<p align="center">
  Vue library for building Dapps
</p>

<p align="center">
  <!-- license -->
  <a href="https://github.com/vu3th/vue-dapp">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"/>
  </a>
</p>

Notice that Vue Dapp v1 is working in progress. I expect to release a stable version by Jan. 31, 2024.

I recommend keeping an eye on [vue-dapp-starter](https://github.com/vu3th/vue-dapp-starter) and [nuxt-dapp](https://github.com/vu3th/nuxt-dapp), as it strives to maintain a development-friendly version whenever possible.

 
## Monorepo Architecture


| Name                    | Description                     | Version                                                                                                                                        | Size                                                                                                                                                             |
| ----------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @vue-dapp/core          | useVueDapp & VueDappProvider    | <a href="https://www.npmjs.com/package/@vue-dapp/core"><img src="https://badgen.net/npm/v/@vue-dapp/core" alt="Version"></a>                   | <a href="https://bundlephobia.com/package/@vue-dapp/core"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/core" alt="Size"></a>                   |
| @vue-dapp/nuxt          | Vue Dapp Nuxt module            | <a href="https://www.npmjs.com/package/@vue-dapp/nuxt"><img src="https://badgen.net/npm/v/@vue-dapp/nuxt" alt="Version"></a>                   | <a href="https://bundlephobia.com/package/@vue-dapp/nuxt"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/nuxt" alt="Size"></a>                   |
| @vue-dapp/modal         | VueDappModal for a wallet modal | <a href="https://www.npmjs.com/package/@vue-dapp/modal"><img src="https://badgen.net/npm/v/@vue-dapp/modal" alt="Version"></a>                 | <a href="https://bundlephobia.com/package/@vue-dapp/modal"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/modal" alt="Size"></a>                 |
| @vue-dapp/walletconnect | WalletConnect integration       | <a href="https://www.npmjs.com/package/@vue-dapp/walletconnect"><img src="https://badgen.net/npm/v/@vue-dapp/walletconnect" alt="Version"></a> | <a href="https://bundlephobia.com/package/@vue-dapp/walletconnect"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/walletconnect" alt="Size"></a> |
| @vue-dapp/coinbase      | Coinbase Wallet integration     | <a href="https://www.npmjs.com/package/@vue-dapp/coinbase"><img src="https://badgen.net/npm/v/@vue-dapp/coinbase" alt="Version"></a>           | <a href="https://bundlephobia.com/package/@vue-dapp/coinbase"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/coinbase" alt="Size"></a>           |


## Installation

Minimum
```bash
npm install pinia @vue-dapp/core
```

With a wallet modal
```bash
npm install pinia @vue-dapp/core @vue-dapp/modal
```

Maximum
```bash
npm install pinia @vue-dapp/core @vue-dapp/modal @vue-dapp/walletconnect @vue-dapp/coinbase
```

## Example

```vue
<script lang="ts" setup>
import { type WalletContext, BrowserWalletConnector, VueDappProvider } from '@vue-dapp/core'

const connectors = [
	new BrowserWalletConnector()
]

function handleConnect({ provider, address, chainId }: WalletContext) {
	console.log('handleConnect')
}

function handleDisconnect() {
	console.log('handleDisconnect')
}

const { status, isConnected, address, chainId, error, disconnect, connectWith } = useVueDapp()

function onClickMetaMask() {
	if (!isConnected.value) {
		connectWith(connectors[0])
	}
}
</script>

<template>
	<div>
		<VueDappProvider @connect="handleConnect" @disconnect="handleDisconnect">
			<div v-if="!isConnected">
				<button :disabled="status !== 'idle'" @click="onClickMetaMask">Connect with MetaMask</button>
			</div>
			<button v-else @click="disconnect">Disconnect</button>

			<div>status: {{ status }}</div>
			<div>isConnected: {{ isConnected }}</div>
			<div>error: {{ error }}</div>

			<div v-if="isConnected">
				<div v-if="chainId !== -1">chainId: {{ chainId }}</div>
				<div>address: {{ address }}</div>
			</div>
		</VueDappProvider>
	</div>
</template>

```

## Support 🙏

Gitcoin Grants 20 coming soon~

## MIT license

Copyright (c) 2021-present, Johnson Chen ([@chnejohnson](https://twitter.com/chnejohnson))
