# useCall and useCalls

[source code](https://github.com/chnejohnson/vue-dapp/blob/main/src/composables/useCall.ts)

## Types
```ts
declare interface Call {
  contract: Contract
  method: string
  args: any[]
}

declare type CallResult =
  | { value: any; error: undefined }
  | { value: undefined; error: Error }
  | undefined

declare function useCall(call: Call): Promise<CallResult>

declare function useCalls(calls: Call[]): Promise<CallResult[]>
```

## Core
- `useCall` - Makes a call to a specific contract method and returns the value or an error.
- `useCalls` - Makes calls to specific contract methods and returns the value(s) or error(s).
   - Networks supporting the contract of [Multicall2](https://github.com/makerdao/multicall/blob/master/src/Multicall2.sol) then the calls will be aggregated and passed as one call using the [Multicall2](https://github.com/makerdao/multicall/blob/master/src/Multicall2.sol) contract.
   - Non [Multicall2](https://github.com/makerdao/multicall/blob/master/src/Multicall2.sol) networks will be processed one by one as normal which of course will cause multiple calls to the network protocoal to process the contract method.

- `results` - return value depending on type `CallResult[]`

## Example
```ts
import { useCalls, Call, ERC20Interface } from 'vue-dapp'

const calls = ['name', 'totalSupply', 'decimals', 'symbol', 'balanceOf'];

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

```