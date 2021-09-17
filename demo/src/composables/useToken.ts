import { ref } from 'vue'
import { Web3Provider } from '@ethersproject/providers'
import { useMulticall, ContractCall, ERC20Interface } from 'vue-dapp'
import { BigNumber } from '@ethersproject/bignumber'

const calls: ContractCall[] = [
  {
    interface: ERC20Interface,
    address: '',
    method: 'name',
  },
  {
    interface: ERC20Interface,
    address: '',
    method: 'totalSupply',
  },
  {
    interface: ERC20Interface,
    address: '',
    method: 'decimals',
  },
  {
    interface: ERC20Interface,
    address: '',
    method: 'symbol',
  },
  {
    interface: ERC20Interface,
    address: '',
    method: 'balanceOf',
    args: [],
  },
]

export function useToken() {
  const name = ref('')
  const totalSupply = ref(BigInt(0))
  const decimals = ref(0)
  const symbol = ref('')
  const balance = ref(BigInt(0))

  async function call(
    provider: Web3Provider,
    tokenAddress: string,
    userAddress: string,
  ) {
    const calls = genCalls(tokenAddress, userAddress)
    const { call, results } = useMulticall(provider)

    await call(calls)

    const [
      [_name],
      [_totalSupply],
      [_decimals],
      [_symbol],
      { balance: _balance },
    ] = results.value

    name.value = _name
    totalSupply.value = _totalSupply
    decimals.value = _decimals
    symbol.value = _symbol
    balance.value = (_balance as BigNumber).toBigInt()
  }

  function genCalls(tokenAddress: string, userAddress: string) {
    return calls.map((call) => {
      call.address = tokenAddress
      if (call.method === 'balanceOf' || call.method === 'allowance') {
        call.args = [userAddress]
      }
      return call
    })
  }

  return {
    name,
    totalSupply,
    decimals,
    balance,
    symbol,
    call,
  }
}
