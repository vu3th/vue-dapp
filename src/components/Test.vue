<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
  setup() {
    const hello = () => {
      console.log('hello')
    }

    hello()

    return {
      hello,
    }
  },
})
</script>

<template>
  <div>
    <button
      @click="hello"
      class="red"
    >Test</button>
  </div>
</template>

<style scoped>
.red {
  color: red;
}
</style>