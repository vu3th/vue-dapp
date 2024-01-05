<p align="center">
   <a href="https://vue-dapp-docs.vercel.app/">
    <img src="https://github.com/vu3th/vue-dapp/blob/main/demo/src/assets/logo.png" alt="VueDapp Brand" style="max-width:100%;" width="400">
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

Notice that Vue Dapp v1 is working in progress. I expect to release a stable version by June 30, 2024.

I recommend keeping an eye on [vue-dapp-starter](https://github.com/vu3th/vue-dapp-starter) and [nuxt-dapp](https://github.com/vu3th/nuxt-dapp), as it strives to maintain a development-friendly version whenever possible.

 
## Monorepo Architecture


| Name                    | Description                                       | Version                                                                                                                                        | Size                                                                                                                                                             |
| ----------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @vue-dapp/core          | useWalletStore, connector, utils, and metamask... | <a href="https://www.npmjs.com/package/@vue-dapp/core"><img src="https://badgen.net/npm/v/@vue-dapp/core" alt="Version"></a>                   | <a href="https://bundlephobia.com/package/@vue-dapp/core"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/core" alt="Size"></a>                   |
| @vue-dapp/vd-board      | Vue components for connecting wallet              | <a href="https://www.npmjs.com/package/@vue-dapp/vd-board"><img src="https://badgen.net/npm/v/@vue-dapp/vd-board" alt="Version"></a>           | <a href="https://bundlephobia.com/package/@vue-dapp/vd-board"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/vd-board" alt="Size"></a>           |
| @vue-dapp/walletconnect | WalletConnect integration                         | <a href="https://www.npmjs.com/package/@vue-dapp/walletconnect"><img src="https://badgen.net/npm/v/@vue-dapp/walletconnect" alt="Version"></a> | <a href="https://bundlephobia.com/package/@vue-dapp/walletconnect"><img src="https://img.shields.io/bundlephobia/minzip/@vue-dapp/walletconnect" alt="Size"></a> |


## Installation

```bash
yarn add @vue-dapp/core @vue-dapp/walletconnect
```

## Example

```vue
<script lang="ts" setup>
import { type WalletContext, MetaMaskConnector, VueDappProvider } from '@vue-dapp/core'
import { WalletConnectConnector } from '@vue-dapp/walletconnect'

const connectors = [
	new MetaMaskConnector(),
	new WalletConnectConnector({
		projectId: '3f3c98042b194264687bf59e104c534a',
		chains: [1],
		showQrModal: true,
		qrModalOptions: {
			themeMode: 'dark',
			themeVariables: undefined,
			desktopWallets: undefined,
			walletImages: undefined,
			mobileWallets: undefined,
			enableExplorer: true,
			privacyPolicyUrl: undefined,
			termsOfServiceUrl: undefined,
		},
	}),
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

function onClickWalletConnect() {
	if (!isConnected.value) {
		connectWith(connectors[1])
	}
}
</script>

<template>
	<div>
		<VueDappProvider @connect="handleConnect" @disconnect="handleDisconnect">
			<div v-if="!isConnected">
				<button :disabled="status !== 'idle'" @click="onClickMetaMask">Connect with MetaMask</button>
				<button :disabled="status !== 'idle'" @click="onClickWalletConnect">Connect with WalletConnect</button>
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

Gitcoin Grants 19: https://explorer.gitcoin.co/#/round/424/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008/0xd4cc0dd193c7dc1d665ae244ce12d7fab337a008-75

## MIT license

Copyright (c) 2021-present, Johnson Chen ([@chnejohnson](https://twitter.com/chnejohnson))
