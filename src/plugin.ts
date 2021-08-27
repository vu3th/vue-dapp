import { Plugin } from 'vue-demi'
import Test from './components/Test.vue'
import Board from './components/Board.vue'

export const VueDapp: Plugin = {
  install(app, options) {
    app.component('test', Test)
    app.component('board', Board)
  },
}
