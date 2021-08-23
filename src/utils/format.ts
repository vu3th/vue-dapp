import { BigNumber } from 'ethers'
import { formatEther, isAddress } from 'ethers/lib/utils'

export const shortenAddress = (address: string): string => {
  if (isAddress(address)) {
    return address.slice(0, 6) + '...' + address.slice(-4)
  } else {
    return ''
  }
}

export const displayEther = (balance: BigNumber, fixed: number) => {
  return (+formatEther(balance)).toFixed(fixed)
}
