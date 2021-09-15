<script lang="ts">
import { formatEther } from '@ethersproject/units'
import { computed, defineComponent, ref } from 'vue'
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
    const { status, disconnect, error, provider } = useWallet()
    const { address, balance, chainId, isActivated } = useEthers()

    const modalOpen = ref(false)
    const openModal = () => {
      modalOpen.value = true
    }
    const closeModal = () => {
      modalOpen.value = false
    }

    const personalSign = async () => {
      openModal()

      try {
        const signedData = await provider.value!.request({
          method: 'personal_sign',
          params: ['Hello World', address.value],
        })
        console.log(signedData)
      } catch (e) {
        console.error(e.message)
      } finally {
        closeModal()
      }
    }

    return {
      isActivated,
      address,
      status,
      error,
      displayBalance: computed(() => formatEther(balance.value)),
      chainId,
      disconnect,
      open,
      modalOpen,
      openModal,
      closeModal,
      personalSign,
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
      <p>{{ address }}</p>
      <p>{{ displayBalance || ''}} ETH</p>
      <p>{{ chainId }}</p>
    </div>

    <div class="m-4">
      <button
        @click="status === 'connected' ? disconnect() : open()"
        class="btn"
        :disabled="status === 'connecting'"
      >{{ status === 'connected' ? "Disconnect" : status === 'connecting' ? "Connecting..." : "Connect" }}</button>
    </div>

    <div v-if="isActivated">
      <div class="m-4">
        <button
          @click="personalSign"
          class="btn"
        >personal_sign</button>
      </div>

      <vdapp-modal
        :modalOpen="modalOpen"
        @close="closeModal"
      >
        <div class="p-10 text-center">
          <p class="text-xl">Pending Call Request</p>
          <p>Approve or reject request using your wallet</p>
        </div>
      </vdapp-modal>
    </div>

    <Token />
  </div>
  <vdapp-board />
</template>
