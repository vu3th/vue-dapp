---
description: ''
head:
  meta:
    - name: 'keywords'
      content: ''
---

# @vue-dapp/modal

Use it first, then remove it later as you wish to customize your modal.

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

## VueDappModal

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

