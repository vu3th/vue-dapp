import { CallMethod } from './CallMethod'
import { CallMulticall2 } from './CallMulticall2'
import { CallInterface } from '../types/call/CallTypes'
import { ChainId } from '../constants/chainId'
import { useEthers } from '../composables/useEthers'
const { chainId } = useEthers()
export class CallFactory {
  static getCallInstance(): CallInterface {
    switch (chainId.value) {
      case ChainId.Mainnet:
      case ChainId.Kovan:
      case ChainId.Rinkeby:
      case ChainId.Goerli:
      case ChainId.Ropsten:
        return new CallMulticall2()
      default:
        return new CallMethod()
    }
  }
}
