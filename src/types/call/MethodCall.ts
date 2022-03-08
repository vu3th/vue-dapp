import { Contract } from '@ethersproject/contracts'

// https://github.com/makerdao/multicall/blob/master/src/Multicall2.sol
// struct Call {
//     address target;
//     bytes callData;
// }
export interface MethodCall {
  contract: Contract
  method: string
  args: any[]
  address: string
  data: string
}
