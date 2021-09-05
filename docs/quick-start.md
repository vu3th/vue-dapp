# Quick Start
Add dependencies to your main.ts:

```javascript
import { VueDapp, Config } from 'vue-dapp'

const app = createApp(App)
const dappConfig: Partial<Config> = {
  infuraId: 'your-infura-id', // for enabling WalletConnect
}

app.use(VueDapp, dappConfig)
...
```

Add the global component to your App.vue:

```vue
<board />
```

Use wallet or board from your .vue files:

```javascript
import { defineComponent } from 'vue'
import { useBoard, useEthers, useWallet } from 'vue-dapp'

export default defineComponent({
  name: 'App',
  inject: ['dappConfig'],
  setup() {
    const { open } = useBoard()
    const { status, disconnect, error } = useWallet()
    const { address } = useEthers()

    return {
      address,
      status,
      error,
      disconnect,
      open,
    }
  },
})
```

Add CDN in index.html for enabling WalletConnect:

```html
<body>
  <div id="app"></div>

  <!-- this line -->
  <script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.6.5/dist/umd/index.min.js"></script>
  <script type="module" src="/src/main.ts"></script>
</body>
```
(More about [issue of walletconnect](https://github.com/chnejohnson/vue-dapp/issues/3))

