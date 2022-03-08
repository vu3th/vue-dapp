import { Call } from './Call'
import { MethodCallResult } from './MethodCallResult'
export interface CallInterface {
  executeCall(calls: Call[]): Promise<MethodCallResult[]>
}
