<template>
  <div class="h-full flex flex-col justify-center items-center">
    <p>{{ address }}</p>
    <p v-if="isConnected">{{ fixedBalance() }} ETH</p>

    <div class="m-4">
      <button
        v-if="!isConnected"
        @click="connectMetamask"
        class="btn"
      >Connect</button>
      <!-- <button
        v-if="isConnected"
        @click="disconnect"
        class="btn"
      >Disconnect</button> -->
    </div>
  </div>
  <!-- <board /> -->
</template>

<script lang="ts">
import { useWallet, Wallet } from 'vue-dapp'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const { connect, address, fixedBalance, isConnected } = useWallet()
    const connectMetamask = async () => {
      await connect(Wallet.metamask)
    }

    return {
      address,
      isConnected,
      open,
      fixedBalance,
      connectMetamask,
    }
  },
})
</script>
