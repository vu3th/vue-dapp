---
description: ''
head:
  meta:
    - name: 'keywords'
      content: ''
---

# Installation

```bash
npm install pinia @vue-dapp/core @vue-dapp/modal
```

```ts [main.ts]
import { createPinia } from 'pinia'
app.use(createPinia())
```

## Nuxt

```bash
npm install pinia @pinia/nuxt @vue-dapp/core @vue-dapp/nuxt @vue-dapp/modal
```

```ts
modules: ['@pinia/nuxt', '@vue-dapp/nuxt']
```

## Add Connectors

```bash
npm install @vue-dapp/walletconnect
```

```bash
npm install @vue-dapp/coinbase
```

```ts
import { BrowserWalletConnector, useVueDapp } from '@vue-dapp/core'
import { WalletConnectConnector } from '@vue-dapp/walletconnect'
import { CoinbaseWalletConnector } from '@vue-dapp/coinbase'

const { addConnectors } = useVueDapp()

addConnectors([
	new BrowserWalletConnector(),
	new WalletConnectConnector({
		projectId: 'd1e65611568666138126d315c0bafd7d',
		chains: [1],
		showQrModal: true,
		qrModalOptions: {
			themeMode: 'light',
			themeVariables: undefined,
			desktopWallets: undefined,
			walletImages: undefined,
			mobileWallets: undefined,
			enableExplorer: true,
			privacyPolicyUrl: undefined,
			termsOfServiceUrl: undefined,
		},
	}),
	new CoinbaseWalletConnector({
		appName: 'Vue Dapp',
		jsonRpcUrl: 'https://ethereum-rpc.publicnode.com'
	}),
])
```

<!-- ## Integrate with Ethers.js -->