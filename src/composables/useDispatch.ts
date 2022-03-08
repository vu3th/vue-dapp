import { FunctionHandler, DispatchAction } from '../types/call/CallTypes'
import {
  unifyObjectStyle,
  retrieveActionInfo,
  createWrapperFunction,
} from '../utils/calls'

// Define a module scope _actions variable to register actions
const _actions = Object.create(null)

// Dispatch actions asyncronously
export function useDispatch() {
  function registerAction(
    action: DispatchAction | string,
    handler: FunctionHandler | Promise<any>,
  ) {
    const { type, hookName } = retrieveActionInfo(action)
    const wrapped = createWrapperFunction({
      hookName,
      handler,
      options: { dispatch },
    })
    const entry = _actions[type] || (_actions[type] = [])
    entry.push(wrapped)
  }

  function unregisterAction(action: DispatchAction | string) {
    const { type, hookName } = retrieveActionInfo(action)
    const entry = _actions[type]
    if (entry) {
      if (entry.length > 1) {
        const idx = entry.findIndex((i: any) => i.name === hookName)
        if (idx >= 0) {
          entry.splice(idx, 1)
        } else {
          console.warn(`Could not unregister for Action : ${hookName}`)
        }
      } else {
        entry.pop()
      }
    } else {
      console.warn(
        `Could not unregister for Type : ${type} and Action: ${hookName}`,
      )
    }
  }

  function dispatch(_type: any, _payload?: any) {
    // check object-style dispatch
    const { type, payload } = unifyObjectStyle(_type, _payload)

    const entry = _actions[type]
    if (!entry) {
      console.error(`[useDispatch] unknown action type: ${type}`)
      return
    }

    const result =
      entry.length > 1
        ? Promise.all(entry.map((handler: FunctionHandler) => handler(payload)))
        : entry[0](payload)

    return new Promise((resolve, reject) => {
      result.then(
        (res: any) => {
          //console.log('resolving dispatch', res);
          resolve(res)
        },
        (error: any) => {
          console.warn(`[useDispatch] error: ${error.message}`)
          console.error(error)
          reject(error)
        },
      )
    })
  }
  return {
    dispatch,
    registerAction,
    unregisterAction,
  }
}
