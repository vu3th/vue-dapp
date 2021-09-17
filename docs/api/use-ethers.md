# useEthers

[source code](https://github.com/chnejohnson/vue-dapp/blob/main/src/composables/useEthers.ts)

## Types
```typescript
declare function useEthers(): {
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
    balance: Ref<bigint>;
    chainId: vue_demi.ComputedRef<number | undefined>;
    activate: typeof activate;
    deactivate: () => void;
};
declare function activate(walletProvider: WalletProvider): Promise<void>;
```

## Core

These state store globally outside the function `useEthers`.

- `isActivated` - boolean to present if the state below is available 
- `provider` - refer to ethers.js [Web3Provider](https://docs.ethers.io/v5/api/providers/other/#Web3Provider)
- `signer` - refer to ethers.js [Signer](https://docs.ethers.io/v5/api/signer/#Signer)
- `network` - refer to ethers.js [Network](https://docs.ethers.io/v5/api/providers/types/#providers-Network)
- `address` - user's address
- `balance` - user's balance, type of js [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- `chainId` - network ID 
