import { useDispatch } from './useDispatch'
import type {
  MethodCall,
  MethodCallResult,
  AggregateCallResult,
} from '../types/call/CallTypes'

const { dispatch, registerAction, unregisterAction } = useDispatch()
/*
    Call back function to execute and read the contract function result when multicall is not supported
*/
async function CONTRACT_AGGREGATE_EXECUTE(call: MethodCall) {
  const callValue = await call.contract[call.method](...call.args)
  return {
    value: callValue,
    success: true,
    key: `${call.address}/${call.data}`,
  }
}

export async function useMethodCalls(
  calls: (MethodCall | undefined)[],
): Promise<MethodCallResult[]> {
  if (!calls) {
    return []
  }

  calls.map((call) => {
    if (call) {
      try {
        registerAction(
          {
            type: 'CONTRACT_AGGREGATE',
            hookName: `${call.address}/${call.data}`,
          },
          CONTRACT_AGGREGATE_EXECUTE(call),
        )
      } catch {
        /* left blank */
      }
    }
  })

  let aggregateResults: AggregateCallResult | AggregateCallResult[] = []
  try {
    aggregateResults = (await dispatch('CONTRACT_AGGREGATE', 'hello')) as
      | AggregateCallResult
      | AggregateCallResult[]
  } catch {
    /* left blank */
  }

  const dispatchResults = calls.map((call) => {
    if (call) {
      try {
        if (Array.isArray(aggregateResults)) {
          const actionResultIdx = aggregateResults.findIndex(
            (i: any) => i.key === `${call.address}/${call.data}`,
          )
          const actionResult = aggregateResults[actionResultIdx]
          // and remove it from the results
          aggregateResults.splice(actionResultIdx, 1)
          return actionResult
            ? { value: actionResult.value, success: actionResult.success }
            : undefined
        } else {
          return aggregateResults
            ? {
                value: aggregateResults.value,
                success: aggregateResults.success,
              }
            : undefined
        }
      } catch {
        return undefined
      } finally {
        unregisterAction({
          type: 'CONTRACT_AGGREGATE',
          hookName: `${call.address}/${call.data}`,
        })
      }
    }
    return undefined
  })
  return dispatchResults
}

export async function useMethodCall(call: MethodCall) {
  return (await useMethodCalls([call]))[0]
}
