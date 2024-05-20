export * from './format'
export * from './assert'

export const isWindowEthereumAvailable = typeof window !== 'undefined' && !!window.ethereum

/**
 * Both mobile web browsers and mobile apps with embedded browsers are considered as mobile browsers.
 * @returns boolean
 */
export function isMobileBrowser() {
	const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
	return regex.test(navigator.userAgent)
}
