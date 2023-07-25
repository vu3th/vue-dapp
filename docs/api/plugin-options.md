# Plugin Options

- All properties in Plugin Options are optional

## Types
```ts
type PluginOptions = {
    autoConnect: boolean;
    persistDisconnect?: boolean;
    networks: {
        [key: number]: AddEthereumChainParameter;
    };
};
```

## autoConnect
- Default: false
- If set up to true, will trigger auto-connect when the page load

## persistDisconnect
- Only take effect when autoConnect is true
- Default to true when autoConnect is true
- If set up to false, the page would trigger auto-connect even if user clicked disconnect button and refreshed the page

## networks
[TBD]

## Example
```ts
app.use(VueDapp, {
  autoConnect: true,
  networks: {
    80001: {
      chainId: ethers.toQuantity(80001),
      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      chainName: 'Mumbai',
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      nativeCurrency: {
        name: 'Mumbai',
        decimals: 18,
        symbol: 'MATIC',
      },
    },
    42161: {
      chainId: ethers.toQuantity(42161),
      blockExplorerUrls: ['https://arbiscan.io'],
      chainName: 'Arbitrum One',
      rpcUrls: ['https://arb1.arbitrum.io/rpc'],
      nativeCurrency: {
        name: 'Arbitrum',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  },
})
```
