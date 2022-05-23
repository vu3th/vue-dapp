<script setup lang="ts">
import Header from './components/Header.vue'
import Dropdown from './components/Dropdown.vue'
import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
  ChainId,
  useEthersHooks,
  MetaMaskConnector,
  WalletConnectConnector,
  CoinbaseWalletConnector,
} from 'vue-dapp'
import { ref, watch } from 'vue'

const isDev = window.location.host === 'localhost:3000'
const infuraId = isDev
  ? 'fd5dad2d869c4b20a703ea9f100333f7'
  : 'ff6a249a74e048f1b413cba715f98d07'

const { open } = useBoard()
const { wallet, disconnect } = useWallet()
const { address, balance, chainId, isActivated } = useEthers()
const { onActivated, onChanged } = useEthersHooks()

const connectors = [
  new MetaMaskConnector(),
  new WalletConnectConnector({
    qrcode: true,
    rpc: {
      1: `https://mainnet.infura.io/v3/${infuraId}`,
    },
  }),
  new CoinbaseWalletConnector({
    appName: 'Vue Dapp',
    jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
  }),
]

const supportedChainId = [
  ChainId.Mainnet,
  ChainId.Rinkeby,
  ChainId.Arbitrum,
  ChainId.Rinkarby,
  ChainId.Polygon,
]
const selectedChainId = ref(0)

onActivated(() => {
  selectedChainId.value = chainId.value as number
})

onChanged(() => {
  selectedChainId.value = chainId.value as number
})

// For turning back to previous chainId without calling switchChain() again
const switchError = ref(false)
watch(selectedChainId, async (val, oldVal) => {
  if (oldVal === 0) return // ignore initial change
  if (switchError.value) {
    switchError.value = false
    return
  }
  try {
    if (wallet.connector) {
      await wallet.connector.switchChain!(val)
    }
  } catch (e: any) {
    switchError.value = true
    selectedChainId.value = oldVal
    console.error(e)
  }
})
</script>

<template>
  <Header></Header>

  <!-- banner -->
  <div class="mt-30 flex flex-col items-center">
    <img class="w-90" src="./assets/logo.png" alt="logo" />
    <p class="bold text-md px-4 sm:text-xl">
      Vue 3 library for building Dapps on Ethereum
    </p>
  </div>

  <!-- connect -->
  <div class="mt-10 flex flex-col justify-center items-center">
    <p v-if="wallet.error" class="text-red-500">{{ wallet.error }}</p>

    <div v-if="isActivated" class="text-center">
      <p>{{ shortenAddress(address) }}</p>
      <p>{{ displayEther(balance) }} ETH</p>

      <!-- Network -->
      <Dropdown
        class="mt-2"
        :options="supportedChainId"
        v-model:selected="selectedChainId"
        :filter-fn="displayChainName"
      ></Dropdown>
    </div>

    <div class="m-4">
      <button
        @click="isActivated ? disconnect() : open()"
        class="btn"
        :disabled="wallet.status === 'connecting'"
      >
        {{
          wallet.status === 'connected'
            ? 'Disconnect'
            : wallet.status === 'connecting'
            ? 'Connecting...'
            : 'Connect'
        }}
      </button>
    </div>
  </div>

  <vdapp-board :connectors="connectors" dark>
    <!-- <template #loading>
      <div v-if="wallet.status === 'loading'"></div>
    </template> -->
  </vdapp-board>
</template>
