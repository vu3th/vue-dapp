import { ref, markRaw } from 'vue-demi'
import { Contract } from '@ethersproject/contracts'
import MULTICALL2_ABI from '../constants/abi/Multicall2.json'
import { Multicall2 } from '../types/multicall2/Multicall2'
import { Web3Provider } from '@ethersproject/providers'

export const MULTICALL2_ADDRESS = '0x5ba1e12693dc8f9c48aad8770482f4739beed696'

interface Call {
  target: string
  callData: string
}

interface ReturnData {
  success: boolean
  returnData: string
  0: boolean
  1: string
}

export function useMulticall(provider: Web3Provider) {
  const multicall = markRaw(
    new Contract(MULTICALL2_ADDRESS, MULTICALL2_ABI, provider) as Multicall2,
  )

  const lastBlockNumber = ref(0)
  const returnData = ref<ReturnData[]>([])

  async function call(calls: Call[]) {
    const results = await multicall.callStatic.tryBlockAndAggregate(
      false,
      calls,
    )

    lastBlockNumber.value = results.blockNumber.toNumber()
    returnData.value = results.returnData
  }

  return {
    returnData,
    multicall,
    lastBlockNumber,
    call,
  }
}
