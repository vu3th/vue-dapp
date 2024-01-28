# @vue-dapp/modal

### Usage

script
```ts
import { VueDappModal } from '@vue-dapp/modal'
import '@vue-dapp/modal/dist/style.css'

const connectors = [
  new MetaMaskConnector()
]

function connectErrorHandler(err: any) {
	console.error('ConnectError', err)
}
function autoConnectErrorHandler(err: any) {
	console.error('AutoConnectError', err)
}
```

template
```vue
<VueDappModal
	:connectors="connectors"
	dark
	autoConnect
	:autoConnectErrorHandler="autoConnectErrorHandler"
	:connectErrorHandler="connectErrorHandler"
/>
```

### Props

- `dark`: boolean, defaults: false - When set to true, the board will be set to dark mode.
- `connectors`: Connectors[], defaults: []
- `autoConnectErrorHandler`: Function, default: () => void - catch error when a auto-connect error occurs.
- `connectErrorHandler`: Function, default: () => void - catch error when a connect error occurs.