<script lang="ts">
import { defineComponent } from 'vue'
import { useWallet, useBoard } from 'vue-dapp'

export default defineComponent({
  name: 'App',
  setup() {
    const { address, fixedBalance, isConnected, disconnect, error, network } =
      useWallet()
    const { open } = useBoard()

    return {
      network,
      error,
      address,
      isConnected,
      fixedBalance,
      disconnect,
      open,
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

    <p>{{ address }}</p>
    <p v-if="isConnected">Network: {{ network?.name }}</p>
    <p v-if="isConnected">{{ fixedBalance(3) }} ETH</p>

    <div class="m-4">
      <button
        @click="isConnected ? disconnect() : open()"
        class="btn"
      >{{ isConnected ? "Disconnect" : "Connect" }}</button>
    </div>
  </div>

  <board />
</template>
