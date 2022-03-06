import { ref, markRaw } from 'vue'
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from 'ethers';

import { useCalls, Call, ERC20Interface } from 'vue-dapp'

const calls = ['name', 'totalSupply', 'decimals', 'symbol', 'balanceOf'];
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
    const tokenContract = markRaw(new Contract(tokenAddress, ERC20Interface, provider));

    const tokenCalls = calls.map((call) => {
      const tokenCall = {
        contract: tokenContract,
        method: call,
        args: [],
      } as Call;
  
      if (call === 'balanceOf') {
        tokenCall.args = [userAddress];
      }
      return tokenCall;
    });

    const callResults = await useCalls(tokenCalls);
    const [_name, _totalSupply, _decimals, _symbol, _balance] = callResults;
  
    name.value = _name?.value ?? '';
    totalSupply.value = _totalSupply?.value ?? BigInt(0);
    decimals.value = _decimals?.value ?? 0;
    symbol.value = _symbol?.value ?? '';
    balance.value = _balance?.value ?? BigInt(0);
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
