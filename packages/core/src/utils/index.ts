export * from './format'
export * from './assert'

export const isWindowEthereumAvailable = typeof window !== 'undefined' && !!window.ethereum
