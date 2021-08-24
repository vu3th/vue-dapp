<template>
  <div class="h-full flex justify-center items-center">
    <button
      @click="open"
      class="btn"
    >Connect</button>
  </div>
  <board />
</template>

<script lang="ts">
import { useBoard } from 'vue-dapp'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const { open } = useBoard()

    return {
      open,
    }
  },
})
</script>
