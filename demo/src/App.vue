<template>
  <div class="h-full flex flex-col justify-center items-center">
    <p>{{ address }}</p>
    <p v-if="isConnected">{{ fixedBalance() }} ETH</p>

    <div class="m-4">
      <button
        v-if="!isConnected"
        @click="open"
        class="btn"
      >Connect</button>
      <button
        v-if="isConnected"
        @click="disconnect"
        class="btn"
      >Disconnect</button>
    </div>
  </div>
  <board />
</template>

<script lang="ts">
import { useBoard, useWallet } from 'vue-dapp'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const { open } = useBoard()
    const { address, fixedBalance, isConnected, disconnect } = useWallet()

    return {
      address,
      isConnected,
      open,
      fixedBalance,
      disconnect,
    }
  },
})
</script>
