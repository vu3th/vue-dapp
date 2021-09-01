<script lang="ts">
import { defineComponent } from 'vue'
import { useBoard, useEthers, useWallet } from 'vue-dapp'

export default defineComponent({
  name: 'App',
  inject: ['dappConfig'],
  setup() {
    const { open } = useBoard()
    const { status, disconnect, error } = useWallet()
    const { address } = useEthers()

    return {
      address,
      status,
      error,
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

    <div class="m-4">
      <button
        @click="status === 'connected' ? disconnect() : open()"
        class="btn"
        :disabled="status === 'connecting'"
      >{{ status === 'connected' ? "Disconnect" : status === 'connecting' ? "Connecting..." : "Connect" }}</button>
    </div>
  </div>
  <board />
</template>
