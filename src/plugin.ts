import { Plugin } from 'vue'
import { clickOutside } from './directive'
import Board from './components/Board.vue'
import Modal from './components/Modal.vue'
import { AddEthereumChainParameter } from './connectors'
import { useEthers } from './composables/useEthers'
import { NETWORK_DETAILS } from './constants'

type Options = {
  autoConnect: boolean
  networks: {
    [key: number]: AddEthereumChainParameter
  }
}

export const VueDapp: Plugin = {
  install(app, options: Options) {
    if (options.networks) {
      const { availableNetworks } = useEthers()
      availableNetworks.value = { ...NETWORK_DETAILS, ...options.networks }
    }

    app.provide('autoConnect', options.autoConnect || false)
    app.directive('click-outside', clickOutside)
    app.component('vd-board', Board)
    app.component('vd-modal', Modal)
  },
}
