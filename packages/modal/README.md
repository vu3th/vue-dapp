# @vue-dapp/modal

<a href="https://www.npmjs.com/package/@vue-dapp/modal"><img src="https://badgen.net/npm/v/@vue-dapp/modal" alt="Version"></a>



## Two approach to open/close the modal

### v-model

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

### pinia store

- only works with SPA

```ts
import { useVueDappStore } from '@vue-dapp/modal'

const { open, close } = useVueDappStore()
```

Don't add `v-model`
```vue
<VueDappModal
	autoConnect
/>
```
