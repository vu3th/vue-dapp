import { BigNumber } from 'ethers'
import { formatEther, isAddress } from 'ethers/lib/utils'
import { CHAIN_NAMES } from '../constants'
import { checkChainId } from './check'

export function shortenAddress(address: string): string {
  if (isAddress(address)) {
    return address.slice(0, 6) + '...' + address.slice(-4)
  } else {
    return ''
  }
}

export function displayEther(balance: BigNumber | bigint, fixed: number = 2) {
  return (+formatEther(balance)).toFixed(fixed)
}

export function displayChainName(chainId: number) {
  if (!checkChainId(chainId)) {
    console.error('Error: Invalid chainId')
    return 'network not found'
  }
  return CHAIN_NAMES[chainId as keyof typeof CHAIN_NAMES].toLowerCase()
}
