<script lang="ts">
import { defineComponent, onUnmounted, watch, ref } from 'vue'
import { useOnOutsidePress } from 'vue-composable'

// export const useModal = () => {
//   const modalOpen = ref(false)
//   const open = () => {
//     modalOpen.value = true
//   }
//   const close = () => {
//     modalOpen.value = false
//   }
//   return { modalOpen, open, close }
// }

export default defineComponent({
  emits: ['modalClose'],
  props: {
    modalOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const closeModal = () => {
      emit('modalClose')
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
    <div v-if="modalOpen">
      <div class="modal">
        <div ref="clickOutside">
          <div>
            <div>
            </div>
            <!-- slot -->
            <slot />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal {
  @apply flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-500 bg-opacity-70;
}

.modal > div {
  @apply bg-white rounded-xl w-1/2;
}

.modal > div > div {
  @apply flex flex-col items-start;
}

.modal > div > div > div {
  @apply flex items-center w-full;
}

.modal svg {
  @apply ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer hover:text-gray-500;
}
</style>