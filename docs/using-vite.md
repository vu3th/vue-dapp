# Using Vite

If you're using Vite, you should have some settings:

:::tip
Refer to [issue#20](https://github.com/chnejohnson/vue-dapp/issues/20), and welcome to use [vue3-dapp-starter](https://github.com/chnejohnson/vue3-dapp-starter) directly.
:::

- Step 1. Install following dependencies:

```bash
yarn add -D buffer process util
yarn add -D @rollup/plugin-inject
```

- Step 2. Add below settings in `vite.config.ts`:

```ts
import inject from '@rollup/plugin-inject'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
```

- Step 3. Add below scripts in `index.html`:

```html
<script>
  window.global = window
  let global = globalThis
</script>

<script type="module">
  import process from 'process'
  window.process = process
</script>

<script type="module">
  import buffer from 'buffer'
  window.Buffer = buffer.Buffer
</script>

<script type="module">
  import util from 'util'
  window.util = util
</script>
```
