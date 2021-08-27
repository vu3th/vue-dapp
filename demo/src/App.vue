<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useWallet, useBoard } from 'vue-dapp'

export default defineComponent({
  name: 'App',
  setup() {
    const { address, fixedBalance, isConnected, disconnect, error } =
      useWallet()
    const { open, close } = useBoard()

    watch(error, (error) => {
      if (error) close()
    })

    return {
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
    <p>{{ address }}</p>
    <p
      v-if="error"
      class="text-red-500"
    >{{ error }}</p>
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
