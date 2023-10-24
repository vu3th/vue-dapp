# Getting Started

## Installation

```bash
yarn add ethers vue-dapp
```

If you want to support more wallet providers not only MetaMask, you should install respective packages to enable the dynamic import.

- Support WalletConnect
```bash
yarn add @walletconnect/web3-provider
```

- Support Coinbase Wallet
```bash
yarn add @coinbase/wallet-sdk
```

- Support Gnosis Safe
```bash
yarn add @gnosis.pm/safe-apps-provider @gnosis.pm/safe-apps-sdk
```

## Quick Start

Step 1. Add plugin to your app:

```javascript
import { VueDapp } from "vue-dapp";

const app = createApp(App);
app.use(VueDapp);
app.mount("#app");
```

Step 2. By default, VueDapp includes `Mainnet` and `Goerli` networks, but you can extend it to include other networks:

```javascript
app.use(VueDapp, {
 autoConnect: true, // Automatically connect MetaMask wallet when the page is loaded
  networks: {
    80001: {
      chainId: ethers.utils.hexValue(80001),
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
      ...
    },
  },
});

```

For more examples please check:
https://github.com/wagmi-dev/wagmi/blob/main/packages/core/src/constants/chains.ts

Step 3. Add `<vd-board />` to your `App.vue` and add a button to open the board:

```vue

<button @click="open">Connect Wallet</button>
<vd-board :connectors="connectors" dark />
```

Step 4. Construct your connectors and use composable functions in your scripts:

```js
import {
    BitgetWalletConnector,
    MetaMaskConnector,
    WalletConnectConnector,
    CoinbaseWalletConnector,
    useBoard,
} from "vue-dapp";

setup()
{
    const { open } = useBoard();
    const infuraId = "";
    const connectors = [
        new MetaMaskConnector({
            appUrl: "http://localhost:3000",
        }),
        new BitgetWalletConnector(),
        new WalletConnectConnector({
            qrcode: true,
            rpc: {
                1: `https://mainnet.infura.io/v3/${infuraId}`,
                4: `https://rinkeby.infura.io/v3/${infuraId}`,
            },
        }),
        new CoinbaseWalletConnector({
            appName: "Vue Dapp",
            jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
        }),
    ];
    return {
        connectors,
        open,
    };
}
```

Take a look at [Configurations](https://vue-dapp-docs.netlify.app/configurations) for more informations about Vue CLI,
Vite, and Nuxt3 configurations.

To see the demo code, check it out [here](https://github.com/vu3th/vue-dapp/blob/main/demo/src/App.vue).
