import { BigNumber } from 'ethers'
import { formatEther, isAddress } from 'ethers/lib/utils'
import { checkChainId } from './check'
import { useEthers } from '../composables'

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
  const { availableNetworks } = useEthers()
  return availableNetworks.value[chainId].chainName.toLowerCase()
}
