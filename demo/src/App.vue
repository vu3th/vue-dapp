<template>
  <div class="h-full flex justify-center items-center">
    <button
      @click="openBoard"
      class="btn"
    >Connect</button>
  </div>
  <board />
</template>

<script lang="ts">
import { useWallet } from 'vue-dapp'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const { openBoard } = useWallet()

    return {
      openBoard,
    }
  },
})
</script>
