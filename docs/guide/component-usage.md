# Component Usage

Add dependencies to your main.ts:

```javascript
import { VueDapp, Config } from 'vue-dapp'

const app = createApp(App)
const dappConfig: Partial<Config> = {
  infuraId: 'your-infura-id', // only for enabling WalletConnect
}

app.use(VueDapp, dappConfig)
...
```

Add the global component to your App.vue:

```vue
<board />
```

Inject `dappConfig`

```javascript
import { defineComponent, inject } from 'vue'
import { Config } from 'vue-dapp'

export default defineComponent({
  name: 'App',
  inject: ['dappConfig'],
  setup() {
    const config = inject('dappConfig') as Config
  },
})
```