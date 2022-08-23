import { Plugin } from 'vue'
import { clickOutside } from './directive'
import Board from './components/Board.vue'
import Modal from './components/Modal.vue'
import { AddEthereumChainParameter } from './wallets'
import { useEthers } from './composables/useEthers'
import { NETWORK_DETAILS } from './constants'

export const VueDapp: Plugin = {
  install(app, options: { [key: number]: AddEthereumChainParameter }) {
    const { availableNetworks } = useEthers()
    availableNetworks.value = { ...NETWORK_DETAILS, ...options }

    app.directive('click-outside', clickOutside)
    app.component('vd-board', Board)
    app.component('vd-modal', Modal)
  },
}
