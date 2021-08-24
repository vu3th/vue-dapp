<template>
  <div class="h-full flex flex-col justify-center items-center">
    <p>{{ address }}</p>
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

<script lang="ts">
import { defineComponent } from 'vue'
import { useWallet, useBoard } from 'vue-dapp'
import Board from './components/Board.vue'

export default defineComponent({
  name: 'App',
  components: {
    Board,
  },
  setup() {
    const { address, fixedBalance, isConnected, disconnect } = useWallet()
    const { open } = useBoard()

    return {
      address,
      isConnected,
      fixedBalance,
      disconnect,
      open,
    }
  },
})
</script>
