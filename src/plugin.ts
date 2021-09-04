import { Plugin } from 'vue-demi'
import Board from './components/Board.vue'
import { Config } from './types/config'
import { ChainId } from './constants'

const defaultConfig: Config = {
  pollingInterval: 15000,
  supportedChains: [
    ChainId.Mainnet,
    ChainId.Goerli,
    ChainId.Kovan,
    ChainId.Rinkeby,
    ChainId.Ropsten,
    ChainId.BSC,
    ChainId.xDai,
    ChainId.Localhost,
    ChainId.Hardhat,
    ChainId.Polygon,
    ChainId.Mumbai,
    ChainId.Harmony,
  ],
}

export const VueDapp: Plugin = {
  install(app, options: Partial<Config>) {
    app.directive('click-outside', clickOutside)
    app.component('board', Board)
    app.provide('dappConfig', { ...defaultConfig, ...options })
  },
}

const clickOutside = {
  beforeMount: (el: any, binding: any) => {
    el.clickOutsideEvent = (event: MouseEvent) => {
      event.stopPropagation()

      if (event.target !== el && !el.contains(event.target)) {
        binding.value(event)
      }
    }
    const clickHandler =
      'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
    setTimeout(() => {
      document.addEventListener(clickHandler, el.clickOutsideEvent)
    }, 0)
  },
  unmounted: (el: any) => {
    const clickOutsideEvent = el.clickOutsideEvent
    delete el.clickOutsideEvent
    const clickHandler =
      'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
    document.removeEventListener(clickHandler, clickOutsideEvent)
  },
}
