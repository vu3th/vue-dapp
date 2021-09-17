# useEthersHooks

[source code](https://github.com/chnejohnson/vue-dapp/blob/main/src/composables/useEthersHooks.ts)

## Types
```ts
declare type EthersHooksContext = {
    provider: Web3Provider;
    signer: Signer$1;
    network: Network;
    address: string;
    balance: bigint;
};
declare type OnActivatedHook = (context: EthersHooksContext) => void;
declare type OnChangedHook = (context: EthersHooksContext) => void;
declare type OnDeactivatedHook = () => void;
declare function useEthersHooks(): {
    onActivated: (hook: OnActivatedHook) => OnActivatedHook;
    onDeactivated: (hook: OnDeactivatedHook) => OnDeactivatedHook;
    onChanged: (hook: OnChangedHook) => OnChangedHook;
};
```

## Core
- `onActivated` - watch `provider` from `useEthers` while giving value.
- `onDeactivated` - watch `provider` from `useEthers` while removing value.
- `onChanged` - watch `provider` from `useEthers` while updating value.

## Example
```ts
const { onActivated, onDeactivated, onChanged } = useEthersHooks()

onActivated(({ provider, address }) => {
  call(
    provider,
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    address,
  )
})

onDeactivated(() => {
  console.log('deactivated')
})

onChanged(() => {
  console.log('change')
})
```