import { ChainId } from '../constants'

export async function checkInfuraId(infuraId: string) {
  try {
    const res = await fetch(`https://mainnet.infura.io/v3/${infuraId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_blockNumber',
        params: [],
      }),
    })
    const data = await res.json()
    console.log('Infura ID is valid.', data)
    return true
  } catch (e) {
    console.warn(
      'Walletconnect unavailable: Failed to connect to infura node, please check if your infura ID is valid.',
    )
    return false
  }
}

export function checkChainId(chainId: number) {
  if (chainId in ChainId) {
    return true
  }
  return false
}
