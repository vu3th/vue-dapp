# Components

- `<vdapp-board>` - for wallet board.
- `<vdapp-modal>` - for a simple modal.

[source code](https://github.com/chnejohnson/vue-dapp/tree/main/src/components)

## vdapp-board

### Usage
```vue
<vdapp-board :connectors="connectors" dark>
  <template #loading>
    <div v-if="wallet.status === 'loading'">loading...</div>
  </template>
</vdapp-board>
```

### Props

- `dark`: boolean, defaults: false - When set to true, the board will be set to dark mode.
- `connectors`: Connectors[], defaults: [] - An array of [Connectors](/api/connectors.html) that defines the wallet options on board.

### Slots

- `connecting` - Provide a custom content when connecting wallet.
- `loading` - Provide a custom content when loading data.
