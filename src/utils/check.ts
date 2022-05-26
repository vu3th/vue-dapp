import { ChainId } from '../constants'

export async function checkInfuraId(infuraId: string) {
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
  return data.result
}

export function checkChainId(chainId: number) {
  if (chainId in ChainId) {
    return true
  }
  return false
}
