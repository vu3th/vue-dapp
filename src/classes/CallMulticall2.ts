import { CallInterface, Call } from '../types/call/CallTypes'
import { useEthers } from '../composables/useEthers'
import { useMulticall } from '../composables/useMulticall'
import { useDispatch } from '../composables/useDispatch'
import { encodeCallData } from '../utils/calls'

interface MulticallCall {
  target: string
  callData: string
}

interface MultiCallResult {
  success: boolean
  returnData: string
  0: boolean
  1: string
}
/*
    Call back function to execute and read the contract function result when multicall is not supported
*/
async function CONTRACT_MULTICALL2(
  context: any,
  calls2: MulticallCall[],
): Promise<MultiCallResult[]> {
  const { provider } = useEthers()
  if (provider?.value) {
    const { multicall } = useMulticall(provider.value)
    return await multicall.callStatic.tryAggregate(false, calls2)
  }
  return []
}

let registered = false

export class CallMulticall2 implements CallInterface {
  registerMulticall() {
    if (!registered) {
      const { registerAction } = useDispatch()
      registerAction('TRYAGGREGATE', CONTRACT_MULTICALL2)
      registered = !registered
    }
  }
  async executeCall(calls: Call[]): Promise<any> {
    const { provider } = useEthers()
    if (provider?.value) {
      this.registerMulticall()
      const { dispatch } = useDispatch()

      const calls2: MulticallCall[] = calls.map((call) => {
        const encodedCall = encodeCallData(call)
        return {
          target: encodedCall?.address ?? '',
          callData: encodedCall?.data ?? '',
        }
      })

      const returnData = (await dispatch(
        'TRYAGGREGATE',
        calls2,
      )) as MultiCallResult[]
      const aggregatedResults = returnData.map((data, i) => {
        const { returnData, success } = data
        if (!success) console.error(`Failed to call ${calls[i].method}`)
        const { contract, method } = calls[i]
        const iface = contract.interface
        const decodedResult = iface.decodeFunctionResult(method, returnData)
        // decodeFunctionResult returns an array at first glance
        return { value: decodedResult[0], success }
      })

      return aggregatedResults
    }
    return []
  }
}
