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
    app.component('board', Board)
    app.provide('dappConfig', { ...defaultConfig, ...options })
  },
}
