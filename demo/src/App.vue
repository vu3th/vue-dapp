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
  MetaMaskProvider,
  Metamask,
} from 'vue-dapp'
import { ref, watch } from 'vue'

const { open } = useBoard()
const { status, disconnect, error, provider, walletName } = useWallet()
const { address, balance, chainId, isActivated } = useEthers()
const { onActivated, onChanged } = useEthersHooks()

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

watch(selectedChainId, async (val, oldVal) => {
  if (oldVal === 0) return // ignore initial change

  try {
    walletName.value === 'metamask' &&
      (await Metamask.switchChain(provider.value as MetaMaskProvider, val))
  } catch (e: any) {
    console.error(e)
    selectedChainId.value = oldVal
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
    <p v-if="error" class="text-red-500">{{ error }}</p>

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
        :disabled="status === 'connecting'"
      >
        {{
          status === 'connected'
            ? 'Disconnect'
            : status === 'connecting'
            ? 'Connecting...'
            : 'Connect'
        }}
      </button>
    </div>
  </div>
  <vdapp-board />
</template>
