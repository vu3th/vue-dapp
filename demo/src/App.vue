<template>
  <div class="h-full flex justify-center items-center">
    <button class="btn">Connect</button>
  </div>
</template>

<script lang="ts">
import { useToggle } from 'vue-dapp'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const [toggleable, toggle] = useToggle()

    return {
      toggleable,
      toggle,
    }
  },
})
</script>
