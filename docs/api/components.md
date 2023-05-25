# Components

- `<vd-board>` - for wallet board.
- `<vdapp-modal>` - for a simple modal.

[source code](https://github.com/vu3th/vue-dapp/tree/main/src/components)

## vd-board

### Usage
```vue
<vd-board :connectors="connectors" dark>
  <template #loading>
    <div v-if="wallet.status === 'loading'">loading...</div>
  </template>
</vd-board>
```

### Props

- `dark`: boolean, defaults: false - When set to true, the board will be set to dark mode.
- `connectors`: Connectors[], defaults: [] - An array of [Connectors](/api/connectors.html) that defines the wallet options on board.
- `autoConnectErrorHandler`: Function, default: () => void - catch error when a auto-connect error occurs.
- `connectErrorHandler`: Function, default: () => void - catch error when a connect error occurs.
### Slots

- `connecting` - Provide a custom content when connecting wallet.
- `loading` - Provide a custom content when loading data.
