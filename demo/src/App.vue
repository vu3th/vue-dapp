<script setup lang="ts">
import Header from './components/Header.vue'
import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
} from 'vue-dapp'

const { open } = useBoard()
const { status, disconnect, error } = useWallet()
const { address, balance, chainId, isActivated } = useEthers()
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
      <p>
        network:
        <span class="capitalize">
          {{ chainId ? displayChainName(chainId) : '' }}
        </span>
      </p>
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
