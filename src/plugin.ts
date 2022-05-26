import { Plugin } from 'vue'
import { clickOutside } from './directive'
import Board from './components/Board.vue'
import Modal from './components/Modal.vue'

export const VueDapp: Plugin = {
  install(app) {
    app.directive('click-outside', clickOutside)
    app.component('vd-board', Board)
    app.component('vd-modal', Modal)
  },
}
