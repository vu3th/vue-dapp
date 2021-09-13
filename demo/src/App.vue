<script lang="ts">
import { formatEther } from '@ethersproject/units'
import { computed, defineComponent } from 'vue'
import { useBoard, useEthers, useWallet } from 'vue-dapp'
import Token from './components/Token.vue'

export default defineComponent({
  name: 'App',
  components: {
    Token,
  },
  inject: ['dappConfig'],
  setup() {
    const { open } = useBoard()
    const { status, disconnect, error } = useWallet()
    const {
      isConnected,
      address,
      balance,
      lastBlockNumber,
      lastBlockTimestamp,
    } = useEthers()

    return {
      isConnected,
      address,
      status,
      error,
      displayBalance: computed(() => formatEther(balance.value)),
      lastBlockNumber,
      lastBlockTimestamp,
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

    <div
      v-if="address"
      class="text-center"
    >
      <p>{{ address }}</p>
      <p>{{ displayBalance || ''}} ETH</p>
      <p>Block Number: {{ lastBlockNumber || '' }}</p>
      <p>Block Timestamp: {{ lastBlockTimestamp? new Date(lastBlockTimestamp*1000): '' }}</p>
    </div>

    <div class="m-4">
      <button
        @click="status === 'connected' ? disconnect() : open()"
        class="btn"
        :disabled="status === 'connecting'"
      >{{ status === 'connected' ? "Disconnect" : status === 'connecting' ? "Connecting..." : "Connect" }}</button>
    </div>

    <Token />
  </div>
  <board />
</template>
