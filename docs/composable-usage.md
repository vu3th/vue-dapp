# Composable Usage

```javascript
import { defineComponent } from 'vue'
import { useBoard, useEthers, useWallet } from 'vue-dapp'

export default defineComponent({
  name: 'App',
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