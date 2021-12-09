# useEthersHooks

[source code](https://github.com/chnejohnson/vue-dapp/blob/main/src/composables/useEthersHooks.ts)

## Types

```ts
declare type EthersHooksContext = {
  provider: Web3Provider
  signer: Signer
  network: Network
  address: string
  balance: bigint
}
declare type OnActivatedHook = (context: EthersHooksContext) => void
declare type OnChangedHook = (context: EthersHooksContext) => void
declare type OnDeactivatedHook = () => void
declare function useEthersHooks(): {
  onActivated: (hook: OnActivatedHook) => OnActivatedHook
  onDeactivated: (hook: OnDeactivatedHook) => OnDeactivatedHook
  onChanged: (hook: OnChangedHook) => OnChangedHook
}
```

## Core

- `onActivated` - watch `provider` from `useEthers` while giving the provider.
- `onDeactivated` - watch `provider` from `useEthers` while removing the provider.
- `onChanged` - watch `provider` from `useEthers` while updating the provider.

## Example

```ts
const { onActivated, onDeactivated, onChanged } = useEthersHooks()

onActivated(({ provider, address }) => {
  call(provider, '0x6B175474E89094C44Da98b954EedeAC495271d0F', address)
})

onDeactivated(() => {
  console.log('deactivated')
})

onChanged(() => {
  console.log('change')
})
```
