import { Plugin } from 'vue-demi'
import Test from './components/Test.vue'
import Board from './components/Board.vue'
import { DappConfigs, useDappConfig } from './useDappConfig'

export const VueDapp: Plugin = {
  install(app, options: DappConfigs) {
    app.component('test', Test)
    app.component('board', Board)

    if (options) {
      const { setConfig } = useDappConfig()
      setConfig(options)
    }
  },
}
