import { CallInterface, MethodCall } from '../types/call/CallTypes'
import { encodeCallData } from '../utils/calls'
import { useMethodCalls } from '../composables/useMethodCall'

export class CallMethod implements CallInterface {
  async executeCall(calls: MethodCall[]): Promise<any> {
    return await useMethodCalls(calls.map(encodeCallData))
  }
}
