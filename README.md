<p align="center">
	<a href="https://vue-dapp.vercel.app/">
		<img src="https://github.com/vu3th/vue-dapp/blob/main/app/public/logo.png" alt="Vue Dapp Logo" style="max-width:100%;" width="400">
	</a>
</p>

<h2 align="center">
	Vue Dapp
</h2>

<p align="center">
	Empower dapp developers with Vue integration for crypto wallets
</p>

<p align="center">
	<!-- license -->
	<a href="https://github.com/vu3th/vue-dapp/blob/main/LICENSE">
		<img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"/>
	</a>
	<!-- telegram -->
	<a href="https://t.me/+pLwZxOdgdBg3ZTRl">
		<img src="https://img.shields.io/badge/vue--dapp-blue?style=flat&logo=telegram&label=Telegram" alt="Telegram" />
	</a>
	<!-- website -->
	<a href="https://vue-dapp.vercel.app/">
		<img src="https://img.shields.io/website?up_color=blue&up_message=vue-dapp&url=https://vue-dapp.vercel.app/" alt="Website" />
	</a>
</p>



 
## Packages 📦


| Name                    | Description                     | Version                                                                                                                                        | Size                                                                                                                                                             |
| ----------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @vue-dapp/core          | useVueDapp & VueDappProvider    | <a href="https://www.npmjs.com/package/@vue-dapp/core"><img src="https://badgen.net/npm/v/@vue-dapp/core" alt="Version"></a>                   | <a href="https://bundlephobia.com/package/@vue-dapp/core"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/core" alt="Size"></a>                   |
| @vue-dapp/nuxt          | Vue Dapp Nuxt module            | <a href="https://www.npmjs.com/package/@vue-dapp/nuxt"><img src="https://badgen.net/npm/v/@vue-dapp/nuxt" alt="Version"></a>                   | <a href="https://bundlephobia.com/package/@vue-dapp/nuxt"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/nuxt" alt="Size"></a>                   |
| @vue-dapp/modal         | VueDappModal for a wallet modal | <a href="https://www.npmjs.com/package/@vue-dapp/modal"><img src="https://badgen.net/npm/v/@vue-dapp/modal" alt="Version"></a>                 | <a href="https://bundlephobia.com/package/@vue-dapp/modal"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/modal" alt="Size"></a>                 |
| @vue-dapp/walletconnect | WalletConnect integration       | <a href="https://www.npmjs.com/package/@vue-dapp/walletconnect"><img src="https://badgen.net/npm/v/@vue-dapp/walletconnect" alt="Version"></a> | <a href="https://bundlephobia.com/package/@vue-dapp/walletconnect"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/walletconnect" alt="Size"></a> |
| @vue-dapp/coinbase      | Coinbase Wallet integration     | <a href="https://www.npmjs.com/package/@vue-dapp/coinbase"><img src="https://badgen.net/npm/v/@vue-dapp/coinbase" alt="Version"></a>           | <a href="https://bundlephobia.com/package/@vue-dapp/coinbase"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/coinbase" alt="Size"></a>           |

## Overview

<img src="https://github.com/vu3th/vue-dapp/blob/main/app/public/images/overview.png" alt="Vue Dapp Overview" style="max-width:100%;" width="800">


## Installation

Minimum
```bash
npm install pinia @vue-dapp/core
```

With the wallet modal
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
import {
	useVueDapp,
	BrowserWalletConnector,
	VueDappProvider,
	type ConnWallet,
} from '@vue-dapp/core'
import { VueDappModal } from '@vue-dapp/modal'
import '@vue-dapp/modal/dist/style.css' // make sure to add css for the modal

const { status, isConnected, address, chainId, error, disconnect, addConnector } = useVueDapp()

const isModalOpen = ref(false)

function onClickConnectBtn() {
	if (isConnected.value) disconnect()
	else isModalOpen.value = true
}

if (process.client) { // only when using Nuxt 3
	addConnector(new BrowserWalletConnector())
}

function handleConnect(wallet: ConnWallet) {
	console.log('handleConnect', wallet)
	
	// example with ethers v6
	const ethersProvider = new ethers.providers.Web3Provider(provider)
	const signer = await ethersProvider.getSigner()

	dappStore.setUser({
		address,
		signer: markRaw(signer),
		chainId,
	})
}

function handleDisconnect() {
	console.log('handleDisconnect')

	// example
	dappStore.resetUser()
}
</script>

<template>
	<div>
		<VueDappProvider @connect="handleConnect" @disconnect="handleDisconnect">
			<button @click="onClickConnectBtn">{{ isConnected ? 'Disconnect' : 'Connect' }}</button>

			<div>status: {{ status }}</div>
			<div>isConnected: {{ isConnected }}</div>
			<div>error: {{ error }}</div>

			<div v-if="isConnected">
				<div>chainId: {{ chainId }}</div>
				<div>address: {{ address }}</div>
			</div>

			<VueDappModal v-model="isModalOpen" dark auto-connect />
		</VueDappProvider>
	</div>
</template>

```

## Examples

- [vue-dapp-starter](https://github.com/vu3th/vue-dapp-starter) 
- [nuxt-dapp](https://github.com/vu3th/nuxt-dapp)

## Development

```
pnpm dev
pnpm -F core watch
```


## Support 🙏

0x9D75F4EbcB8e7669E59dcc27CBadC698E0F77187

## Credits

- Vue Dapp Logo by @ramuta https://github.com/vu3th/vue-dapp/issues/24
- Favicon.io - Emoji Favicons > Sheaf Of Rice https://favicon.io/emoji-favicons/sheaf-of-rice
