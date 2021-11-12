import { ref } from 'vue'

const boardOpen = ref(false)

export function useBoard() {
  const open = () => {
    boardOpen.value = true
  }
  const close = () => {
    boardOpen.value = false
  }

  return {
    boardOpen,
    open,
    close,
  }
}
