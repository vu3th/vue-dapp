<script lang="ts">
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  emits: ['close'],
  props: {
    dark: {
      type: Boolean,
      required: false,
      default: false,
    },
    modalOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const modalInnerClass = ref(
      props.dark ? 'modal-inner--dark' : 'modal-inner',
    )

    const closeModal = () => {
      emit('close')
    }

    // prevent page scrolling when the modal is open
    watch(
      () => props.modalOpen,
      (value) => {
        if (value) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = ''
        }
      },
    )

    return {
      modalInnerClass,
      closeModal,
    }
  },
})
</script>

<template>
  <teleport to="body">
    <transition name="modal-animation">
      <div v-if="modalOpen" class="modal">
        <div :class="modalInnerClass">
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
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-width: 100%;
  height: 100%;
  background-color: rgba(107, 114, 128, 0.7);
  left: 0px;
  top: 0px;
  z-index: 50;
}

.modal-inner {
  display: flex;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
    rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
}

.modal-inner--dark {
  display: flex;
  color: rgb(199, 199, 199);
  background: #273138;
  border-radius: 1rem;
  box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
    rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
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
