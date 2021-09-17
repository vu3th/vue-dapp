<script lang="ts">
import { defineComponent } from 'vue'
import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
} from 'vue-dapp'

export default defineComponent({
  name: 'App',
  setup() {
    const { open } = useBoard()
    const { status, disconnect, error } = useWallet()
    const { address, balance, chainId, isActivated } = useEthers()

    return {
      isActivated,
      address,
      status,
      error,
      chainId,
      balance,
      open,
      disconnect,
      displayEther,
      displayChainName,
      shortenAddress,
    }
  },
})
</script>

<template>
  <div class="h-full flex flex-col justify-center items-center">

    <p
      v-if="error"
      class="text-red-500"
    >{{ error }}</p>

    <div
      v-if="isActivated"
      class="text-center"
    >
      <p>{{ shortenAddress(address) }}</p>
      <p>{{ displayEther(balance) }} ETH</p>
      <p>network: <span class="capitalize"> {{ chainId ? displayChainName(chainId) : '' }} </span></p>
    </div>

    <div class="m-4">
      <button
        @click="isActivated ? disconnect() : open()"
        class="btn"
        :disabled="status === 'connecting'"
      >{{ status === 'connected' ? "Disconnect" : status === 'connecting' ? "Connecting..." : "Connect" }}</button>
    </div>
  </div>
  <vdapp-board />
</template>
