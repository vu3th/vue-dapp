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

export function displayEther(balance: BigNumber | bigint, fixed = 2) {
  return (+formatEther(balance)).toFixed(fixed)
}

export function displayChainName(chainId: number) {
  if (!checkChainId(chainId)) {
    return ''
  }
  const { availableNetworks } = useEthers()
  return availableNetworks.value[chainId].chainName.toLowerCase()
}

export function normalizeChainId(chainId: string | number) {
  if (typeof chainId === 'string') {
    const isHex = chainId.trim().substring(0, 2)

    return Number.parseInt(chainId, isHex === '0x' ? 16 : 10)
  }
  return chainId
}
