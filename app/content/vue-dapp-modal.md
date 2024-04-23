---
description: ''
head:
  meta:
    - name: 'keywords'
      content: ''
---

# @vue-dapp/modal

## Get started

::code-group

```bash [SPA]
pnpm add pinia @vue-dapp/core @vue-dapp/modal
```

```bash [Nuxt]
pnpm add pinia @pinia/nuxt @vue-dapp/core @vue-dapp/nuxt @vue-dapp/modal
```

```ts [TS]
import { BrowserWalletConnector } from '@vue-dapp/core'
import { VueDappModal, useVueDappModal } from '@vue-dapp/modal'
import '@vue-dapp/modal/dist/style.css' // must add

const { open } = useVueDappModal()
```

```vue [Vue]
<VueDappModal
	dark
	v-model="isModalOpen"
	autoConnect
	autoConnectBrowserWalletIfSolo
	@connectError="connectErrorHandler"
	@autoConnectError="autoConnectErrorHandler"
	hideConnectingModal="false"
/>
```

::

## Props


| Name                           | Type                 | Default   | Description                                         | Version |
| ------------------------------ | -------------------- | --------- | --------------------------------------------------- | ------- |
| modelValue                     | boolean \| undefined | undefined | Whether to open the modal                           |         |
| dark                           | boolean              | false     | Dark mode                                           |         |
| autoConnect                    | boolean              | false     | Whether to autoConnect when the page loaded         |         |
| autoConnectBrowserWalletIfSolo | boolean              | false     | Auto click BrowserWallet if it's the only connector |         |
| hideConnectingModal            | boolean              | false     | Whether to hide the connecting modal                |         |



| Name              | Type          | Description               | Version |
| ----------------- | ------------- | ------------------------- | ------- |
| update:modelValue | () => boolean | For `v-model`             |         |
| connectError      | () => error   | emit error from try-catch |         |
| autoConnectError  | () => error   | emit error from try-catch |         |


## Slots

| Name            | Parameters | Descriptions                      |
| --------------- | ---------- | --------------------------------- |
| no-wallet-found |            | Customize no wallet found message |

### Example
```vue
<VueDappModal>
	<template #no-wallet-found>
		<div class="flex justify-center items-center">No wallets</div>
	</template>
</VueDappModal>
```


## Two approaches to open/close the modal

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

