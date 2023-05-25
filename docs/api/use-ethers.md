# useEthers

Hook for accessing the connected wallet by ethers

[source code](https://github.com/vu3th/vue-dapp/blob/main/src/composables/useEthers.ts)

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
    provider: Ref<Web3Provider | null>;
    signer: Ref<Signer | null>;
    network: Ref<{
        name: string;
        chainId: number;
        ensAddress?: string | undefined;
        _defaultProvider?: ((providers: any, options?: any) => any) | undefined;
    } | null>;
    address: Ref<string>;
    dnsAlias: Ref<string>;
    balance: Ref<bigint>;
    availableNetworks: Ref<{
        [key: number]: AddEthereumChainParameter;
    }>;
    chainId: vue.ComputedRef<number | undefined>;
    activate: typeof activate;
    deactivate: () => void;
    lookupDNS: typeof lookupDNS;
}
```