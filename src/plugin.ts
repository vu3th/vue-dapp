import { Plugin } from 'vue-demi'
import { clickOutside } from './directive'
import Board from './components/Board.vue'
import Modal from './components/Modal.vue'

export type PluginOptions = {
  infuraId?: string
}

export const VueDapp: Plugin = {
  install(app, options: PluginOptions) {
    if (!options?.infuraId) {
      console.warn(
        'For enabling WalletConnect, you should provide infura ID in plugin options like "app.use(VueDapp, { infuraId: <your-infuraId> })"',
      )
    } else {
      app.provide('infuraId', options.infuraId)
    }

    app.directive('click-outside', clickOutside)
    app.component('vdapp-board', Board)
    app.component('vdapp-modal', Modal)
  },
}
