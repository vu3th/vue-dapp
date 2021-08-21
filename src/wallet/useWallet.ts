import { ref } from 'vue-demi'

/**
 * A simple toggler.
 *
 * @param [defaultValue=false]
 */
export const useWallet = () => {
  const boardOpen = ref(false)
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
