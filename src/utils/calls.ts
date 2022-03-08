import type {
  MethodCall,
  Call,
  FunctionArgReturn,
  DispatchAction,
} from '../types/call/CallTypes'

export function unifyObjectStyle(type: any, payload: any, options?: any) {
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }

  return { type, payload, options }
}

export function retrieveActionInfo(action: DispatchAction | string) {
  let { type, hookName } = action as DispatchAction
  type = type ?? action
  hookName = hookName ?? 'wrappedActionHandler'
  return { type, hookName }
}

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object'
}

export function isPromise(val: any) {
  return val && typeof val.then === 'function'
}

export function warnOnInvalidCall(call: Call) {
  if (!call) {
    return
  }
  const { contract, method, args } = call
  console.warn(
    `Invalid contract call: address=${contract.address} method=${method} args=${args}`,
  )
}

export function createWrapperFunction(config: {
  hookName: string
  handler: FunctionArgReturn | Promise<any>
  options?: any
}): FunctionArgReturn {
  const { [config.hookName]: useHookName } = {
    [config.hookName]: (payload: any[]): any => {
      if (typeof config.handler === 'function') {
        let res = config.handler.call(null, config.options, payload)
        if (!isPromise(res)) {
          res = Promise.resolve(res)
        }
        return res
      } else {
        return config.handler
      }
    },
  }

  return useHookName
}

export function encodeCallData(call: Call): MethodCall | undefined {
  if (!call) {
    return undefined
  }
  const { contract, method, args } = call
  if (!contract.address || !method) {
    warnOnInvalidCall(call)
    return undefined
  }
  try {
    return {
      address: contract.address,
      data: contract.interface.encodeFunctionData(method, args),
      contract,
      method,
      args,
    }
  } catch {
    warnOnInvalidCall(call)
    return undefined
  }
}
