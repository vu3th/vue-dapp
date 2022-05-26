import { ref } from 'vue'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { MULTICALL2_ABI, MULTICALL2_ADDRESS } from '../constants'
import { Multicall2 } from '../types/multicall2/Multicall2'
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers'
import { Result, Interface } from '@ethersproject/abi'

export type ContractCall = {
  interface: ContractInterface
  address: string
  method: string
  args?: any[]
}

export function useMulticall(provider: Web3Provider | JsonRpcProvider) {
  const results = ref<Result[]>([])
  const blockNumber = ref(0)

  const multicall = new Contract(
    MULTICALL2_ADDRESS,
    MULTICALL2_ABI,
    provider,
  ) as Multicall2

  interface Call {
    target: string
    callData: string
  }

  async function call(contractCalls: ContractCall[]) {
    const calls: Call[] = contractCalls.map((call) => {
      const iface = getInterface(call.interface)
      return {
        target: call.address,
        callData: iface.encodeFunctionData(call.method, call.args),
      }
    })
    const { blockNumber: blocNum, returnData } = await tryBlockAndAggregate(
      calls,
    )

    results.value = returnData.map((data, i) => {
      if (!data.success)
        console.error(`Failed to call ${contractCalls[i].method}`)
      const iface = getInterface(contractCalls[i].interface)
      return iface.decodeFunctionResult(
        contractCalls[i].method,
        data.returnData,
      )
    })

    blockNumber.value = blocNum.toNumber()
  }

  async function tryBlockAndAggregate(calls: Call[]) {
    return await multicall.callStatic.tryBlockAndAggregate(false, calls)
  }

  return {
    multicall,
    blockNumber,
    results,
    call,
  }
}

function getInterface(contractInterface: ContractInterface): Interface {
  if (Interface.isInterface(contractInterface)) {
    return contractInterface
  }
  return new Interface(contractInterface)
}
