---
description: ''
head:
  meta:
    - name: 'keywords'
      content: ''
---

# @vue-dapp/modal

<a href="https://www.npmjs.com/package/@vue-dapp/modal"><img src="https://badgen.net/npm/v/@vue-dapp/modal" alt="Version"></a>

## Get started

Install

```bash
# spa
pnpm add pinia @vue-dapp/core@latest @vue-dapp/modal@latest

# nuxt
pnpm add pinia @pinia/nuxt @vue-dapp/core@latest @vue-dapp/nuxt@latest @vue-dapp/modal@latest
```

Script

```ts
import { BrowserWalletConnector } from '@vue-dapp/core'
import { VueDappModal, useVueDappModal } from '@vue-dapp/modal'
import '@vue-dapp/modal/dist/style.css' // must add

const { open } = useVueDappModal()
```

Template

```vue
<VueDappModal dark auto-connect />
```

## VueDappModal Props

- autoConnectBrowserWalletIfSolo: Auto click BrowserWallet if it's the only connector

```vue
<VueDappModal
	dark
	v-model="isModalOpen"
	autoConnect
	autoConnectBrowserWalletIfSolo
	@connectError="connectErrorHandler"
	@autoConnectError="autoConnectErrorHandler"
/>
```


## Two approach to open/close the modal

### v-model approach

```ts
const isModalOpen = ref(false)
```

Must add `v-model`
```vue
<VueDappModal
	v-model="isModalOpen"
	autoConnect
/>
```

### pinia approach

```ts
import { useVueDappModal } from '@vue-dapp/modal'

const { open, close } = useVueDappModal()
```

Don't add `v-model`
```vue
<VueDappModal autoConnect />
```

