import { Ref } from 'vue'

// https://github.com/makerdao/multicall/blob/master/src/Multicall2.sol
// struct Result {
//     bool success;
//     bytes returnData;
// }
export type MethodCallResult =
  | {
      value: Ref
      success: boolean
    }
  | undefined
