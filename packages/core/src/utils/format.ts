import { checkChainId } from './check'

/**
 * Convert a number to a hexadecimal value
 */
export function toHex(n: number): string {
	const hexValue = n.toString(16)
	return '0x' + hexValue
}

export function shortenAddress(address: string): string {
	return address.slice(0, 6) + '...' + address.slice(-4)
}

export function displayChainName(chainId: number) {
	if (!checkChainId(chainId)) {
		return ''
	}
	// dev
	// const { availableNetworks } = useEthers()
	// return availableNetworks.value[chainId].chainName.toLowerCase()
}

export function normalizeChainId(chainId: string | number) {
	if (typeof chainId === 'string') {
		const isHex = chainId.trim().substring(0, 2)

		return Number.parseInt(chainId, isHex === '0x' ? 16 : 10)
	}
	return chainId
}
