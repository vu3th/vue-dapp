import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { VueDapp } from 'vue-dapp'
import { ethers } from 'ethers'

const app = createApp(App)

app.use(VueDapp, {
  connectTimeout: 5000,
  autoConnect: true,
  dumb: false,
  networks: {
    137: {
      chainId: ethers.toQuantity(137),
      blockExplorerUrls: ['https://polygonscan.com'],
      chainName: 'Polygon',
      rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
      nativeCurrency: {
        name: 'Matic',
        decimals: 18,
        symbol: 'MATIC',
      },
    },
    80001: {
      chainId: ethers.toQuantity(80001),
      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      chainName: 'Mumbai',
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      nativeCurrency: {
        name: 'Mumbai',
        decimals: 18,
        symbol: 'MATIC',
      },
    },
    42161: {
      chainId: ethers.toQuantity(42161),
      blockExplorerUrls: ['https://arbiscan.io'],
      chainName: 'Arbitrum One',
      rpcUrls: ['https://arb1.arbitrum.io/rpc'],
      nativeCurrency: {
        name: 'Arbitrum',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  },
})

app.mount('#app')
