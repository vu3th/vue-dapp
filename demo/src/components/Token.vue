<script lang="ts">
import { defineComponent } from 'vue'
import { useEthers, useEthersHooks, Web3Provider } from 'vue-dapp'
import { useToken } from '../composables/useToken'

export default defineComponent({
  name: 'Token',
  setup() {
    const { address, isActivated } = useEthers()
    const { call, name, totalSupply, decimals, symbol, balance } = useToken()
    const { onActivated, onDeactivated, onChanged } = useEthersHooks()

    onActivated(({ provider, address }) => {
      doCall(provider, address);    
    })

    onDeactivated(() => {
      console.log('deactivated')
    })

    onChanged(({ provider, address }) => {
      doCall(provider, address);
    })

    const doReset = () => {
      name.value = ''
      totalSupply.value = BigInt(0)
      decimals.value = 0
      symbol.value = ''
      balance.value = BigInt(0)
    }

    const doCall = async (provider:Web3Provider, address:string) => {
      try {
        doReset()
        await call(
          provider,
          '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI Mainnet
          address,
        )
      }
      catch (err : any) {
        console.warn(err.message)
        doReset();
      }
    }
    return {
      isActivated,
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
    v-if="isActivated"
  >
    <div class="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">  
      <h2 class="text-gray-800 text-3xl font-semibold">Multicall</h2>
      <div class="mt-2 text-gray-600 flex flex-col justify-center items-center">
        <p>name: {{ name }}</p>
        <p>totalSupply: {{ totalSupply }}</p>
        <p>decimals: {{ decimals }}</p>
        <p>symbol: {{ symbol }}</p>
        <p>balance: {{ balance }}</p>
      </div>
    </div>
  </div>
</template>
