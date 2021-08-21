import { ref } from 'vue-demi'

const boardOpen = ref(false)

export const useWallet = () => {
  // feat: Board
  const openBoard = () => {
    boardOpen.value = true
  }
  const closeBoard = () => {
    boardOpen.value = false
  }

  return {
    boardOpen,
    openBoard,
    closeBoard,
  }
}
