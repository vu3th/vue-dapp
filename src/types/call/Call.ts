import { Contract } from '@ethersproject/contracts'

export interface Call {
  contract: Contract
  method: string
  args: any[]
}
