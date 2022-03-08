# useDispatch

[source code](https://github.com/chnejohnson/vue-dapp/blob/main/src/composables/useDispatch.ts)

## Types
```ts
declare interface DispatchAction {
  type: string
  hookName?: string
}

declare type FunctionEmptyVoid = () => void
declare type FunctionEmptyReturn = () => any
declare type FunctionArgVoid = (...args: any[]) => void
declare type FunctionArgReturn = (...args: any[]) => any
declare type FunctionHandler =
  | FunctionEmptyVoid
  | FunctionEmptyReturn
  | FunctionArgVoid
  | FunctionArgReturn

declare function useDispatch(): {
    dispatch: (_type: any, _payload?: any) => Promise<unknown> | undefined;
    registerAction: (action: DispatchAction | string, handler: FunctionHandler | Promise<any>) => void;
    unregisterAction: (action: DispatchAction | string) => void;
}
```

## Core
- `useDispatch` - Allows the registering, dispatching and unregistering of actions to be triggered.
    - registerAction - Takes a string or a `DispatchAction` type and registers the handler to be triggered when a `dispatch` is called.
       - NOTE: By using the `DispatchAction` type multiple hooks can be associated with one type.  When that type is dispatched then all hooks will be triggered that were registerd with the `DispatchAction` type.
    - unregisterAction - Takes a string or a DispatchAction and removes the handler so it will not be triggered when a `dispatch` is called.
    - dispatch - Will trigger the handler or handlers associated with the registerd action.

## Example
```ts
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

  calls.map((call) => {
    if (call) {
      try {
        // This will registerd multiple hooks associated with the type `CONTRACT_AGGREGATE`
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
    // Trigger all hooks registered above that are asscociated with `CONTRACT_AGGREGATE`
    aggregateResults = (await dispatch('CONTRACT_AGGREGATE')) as
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
        // Unregister i.e. unregister the hooks that are associate with the type `CONTRACT_AGGREGATE`
        unregisterAction({
          type: 'CONTRACT_AGGREGATE',
          hookName: `${call.address}/${call.data}`,
        })
      }
    }

```