# @vue-dapp/vd-board

### Usage

script
```ts
import { Board } from '@vue-dapp/vd-board'
import '@vue-dapp/vd-board/dist/style.css'

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
<Board
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