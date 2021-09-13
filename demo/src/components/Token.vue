<script lang="ts">
import { defineComponent } from 'vue'
import { useEthers, useToken } from 'vue-dapp'

export default defineComponent({
  name: 'Token',
  inject: ['dappConfig'],
  setup() {
    const { address, onConnected, isConnected } = useEthers()
    const { call, name, totalSupply, decimals, symbol, balance } = useToken()

    onConnected(({ provider }) => {
      call(
        provider,
        '0xa8d4452ae282fc13521c6a4d91fe58bb49719eb4', // Rinkeby MAT
        address.value,
      )
      // try mainnet DAI 0x6B175474E89094C44Da98b954EedeAC495271d0F
    })

    return {
      isConnected,
      address,
      name,
      totalSupply,
      decimals,
      symbol,
      balance,
    }
  },
})
</script>

<template>
  <div
    v-if="isConnected"
    class="flex flex-col justify-center items-center"
  >
    <p>name: {{ name }}</p>
    <p>totalSupply: {{ totalSupply }}</p>
    <p>decimals: {{ decimals }}</p>
    <p>symbol: {{ symbol }}</p>
    <p>balance: {{ balance }}</p>
  </div>
</template>
