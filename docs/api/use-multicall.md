# useMulticall

[source code](https://github.com/chnejohnson/vue-dapp/blob/main/src/composables/useMulticall.ts)

## Types
```ts
declare type ContractCall = {
    interface: ContractInterface;
    address: string;
    method: string;
    args?: any[];
};
declare function useMulticall(provider: Web3Provider | JsonRpcProvider): {
    multicall: Multicall2;
    blockNumber: vue_demi.Ref<number>;
    results: vue_demi.Ref<{
        [x: string]: any;
        [x: number]: any;
    }[]>;
    call: (contractCalls: ContractCall[]) => Promise<void>;
};
```

## Core
- `multicall` - contract of [Multicall2](https://github.com/makerdao/multicall/blob/master/src/Multicall2.sol)
- `blockNumber`
- `results` - return value depending on type `ContractCall[]`
- `call` - call `tryBlockAndAggregate` on [Multicall2](https://github.com/makerdao/multicall/blob/master/src/Multicall2.sol) 

## Example
```ts
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

```