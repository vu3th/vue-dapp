import { Plugin } from 'vue-demi'
import Board from './Board.vue'

export const VueDapp: Plugin = {
  install(app, options) {
    app.component('board', Board)
  },
}
