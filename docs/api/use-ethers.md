# useEthers

## Returns

### State

- These state would generate new one while calling `useEthers` every time.
- Once disconnect, these state would be clean.

#### `provider: Ref<Web3Provider>;`
Refer to ethers.js [Web3Provider](https://docs.ethers.io/v5/api/providers/other/#Web3Provider)

#### `signer: Ref<{ Signer | null>;`
Refer to ethers.js [Signer](https://docs.ethers.io/v5/api/signer/#Signer)

#### `network: Ref< Network | null>`
Refer to ethers.js [Network](https://docs.ethers.io/v5/api/providers/types/#providers-Network)

#### `address: Ref<string>`

#### `chainId: ComputedRef<number | undefined>;`
computed from `network`


### Methods
#### `setup`

#### `onConnected`

`onConnected: (cb: (state: ProviderState) => void) => Promise<void>;`

In this hook, ethers.js setup complete, you can use `ProviderState` to call contract.

```ts
interface ProviderState {
    provider: Web3Provider;
    signer: Signer;
    network: Network;
    address: string;
}
```

## Types
```typescript
declare function useEthers(): {
    provider: Ref<Web3Provider | null>;
    signer: Ref<{ Signer | null>;
    network: Ref< Network | null>;
    address: Ref<string>;
    chainId: ComputedRef<number | undefined>;
    setup: () => Promise<void>;
    onConnected: (cb: (state: ProviderState) => void) => Promise<void>;
};
```