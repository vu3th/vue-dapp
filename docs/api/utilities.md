# Utilities

[source code](https://github.com/chnejohnson/vue-dapp/tree/main/src/utils)

## Types

```ts
declare function shortenAddress(address: string): string;
declare function displayEther(balance: BigNumber | bigint, fixed?: number): string;
declare function displayChainName(chainId: number): string;
declare function checkInfuraId(infuraId: string): Promise<any>;
declare function checkChainId(chainId: number): boolean;
```

[source code](https://github.com/chnejohnson/vue-dapp/tree/main/src/utils)