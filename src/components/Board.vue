<script lang="ts">
import { defineComponent } from 'vue'
import Modal from './Modal.vue'

export default defineComponent({
  components: {
    Modal,
  },
  emits: ['boardClose'],
  props: {
    boardOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { emit }) {
    const closeModal = () => {
      emit('boardClose')
    }
    return {
      closeModal,
    }
  },
})
</script>

<template>
  <Modal
    :modalOpen="boardOpen"
    @modalClose="closeModal"
  >
    <div class="w-full text-center">
      <div class="wallet-item">
        <div class="wallet-select">
          MetaMask
        </div>
      </div>
      <div class="line"></div>
      <div class="wallet-item">
        <div class="wallet-select">
          WalletConnect
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.wallet-item {
  @apply flex justify-center items-center m-2 text-2xl;
}
.wallet-select {
  @apply w-full p-3 cursor-pointer hover:bg-gray-100 py-8 px-4 rounded-xl;
}
.line {
  @apply border-b border-solid;
}
</style>