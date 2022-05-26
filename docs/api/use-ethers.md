# useEthers

Hook for accessing the connected wallet by ethers

[source code](https://github.com/chnejohnson/vue-dapp/blob/main/src/composables/useEthers.ts)

## Usage
```ts
const { address, balance, chainId, isActivated } = useEthers()

onActivated(() => {
    ...
})

return {
    address,
    balance
}
```

## Return Value
```typescript
{
    isActivated: Ref<boolean>;
    provider: Ref<ethers.Web3Provider | null>;
    signer: Ref<ethers.Signer | null>;
    network: Ref<ethers.Network | null>;
    address: Ref<string>;
    balance: Ref<bigint>;
    chainId: vue.ComputedRef<number | undefined>;
    activate: (externalProvider: ExternalProvider): Promise<void>;
    deactivate: () => void;
}
```