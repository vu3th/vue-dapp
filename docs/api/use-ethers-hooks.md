# useEthersHooks

Hook for watching provider from `useEthers` as follows:

- `onActivated` - subscribe event when giving the provider.
- `onDeactivated` - subscribe event when removing the provider.
- `onChanged` - subscribe event when updating the provider.

[source code](https://github.com/vu3th/vue-dapp/blob/main/src/composables/useEthersHooks.ts)

## Usage

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
## Return Value
```ts
{
  onActivated: (hook: OnActivatedHook) => OnActivatedHook;
  onChanged: (hook: OnChangedHook) => OnChangedHook;
  onDeactivated: (hook: OnDeactivatedHook) => OnDeactivatedHook;
}
```

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
```
