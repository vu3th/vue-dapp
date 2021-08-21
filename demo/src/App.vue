<template>
  <div class="h-full flex justify-center items-center">
    <button
      @click="openBoard"
      class="btn"
    >Connect</button>
  </div>
  <!-- @todo auto inject to App -->
  <board
    :boardOpen="boardOpen"
    @boardClose="closeBoard"
  />
</template>

<script lang="ts">
import { useToggle, useWallet } from 'vue-dapp'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const [toggleable, toggle] = useToggle()
    const { boardOpen, openBoard, closeBoard } = useWallet()

    return {
      toggleable,
      boardOpen,
      openBoard,
      closeBoard,
      toggle,
      open,
      close,
    }
  },
})
</script>
