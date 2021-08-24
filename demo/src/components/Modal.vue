<script lang="ts">
import { defineComponent, onUnmounted, watch, ref } from 'vue'
import { useOnOutsidePress } from 'vue-composable'

export const useModal = () => {
  const modalOpen = ref(false)
  const open = () => {
    modalOpen.value = true
  }
  const close = () => {
    modalOpen.value = false
  }
  return { modalOpen, open, close }
}

export default defineComponent({
  emits: ['close'],
  props: {
    modalOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close')
    }

    const clickOutside = ref(null)
    useOnOutsidePress(clickOutside, () => closeModal())

    watch(
      () => props.modalOpen,
      (value) => {
        if (value) {
          document.body.classList.add('overflow-hidden')
        } else {
          document.body.classList.remove('overflow-hidden')
        }
      },
    )

    onUnmounted(() => {
      document.body.classList.remove('overflow-hidden')
    })

    return {
      closeModal,
      clickOutside,
    }
  },
})
</script>

<template>
  <teleport to="body">
    <transition name="modal-animation">
      <div
        v-if="modalOpen"
        class="modal"
      >
        <div
          class="modal-inner"
          ref="clickOutside"
        >
          <div class="modal-content">
            <!-- Modal Content -->
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal {
  @apply flex flex-col space-y-4 min-w-screen h-screen bg-gray-500 bg-opacity-70 fixed
   left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none;
}

.modal-inner {
  @apply flex bg-white shadow-xl rounded-2xl;
}

.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}
</style>