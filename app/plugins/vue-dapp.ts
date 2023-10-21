import { VueDapp } from "@vue-dapp/legacy";
import { ethers } from "ethers";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDapp, {
    autoConnect: true,
    dumb: true,
    networks: {
      80001: {
        chainId: ethers.utils.hexValue(80001),
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
        chainName: "Mumbai",
        rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
        nativeCurrency: {
          name: "Mumbai",
          decimals: 18,
          symbol: "MATIC",
        },
      },
      // 這裡要加上，才能在 wallet 沒有此 network 的時候，自動新增 network
      42161: {
        chainId: ethers.utils.hexValue(42161),
        blockExplorerUrls: ["https://arbiscan.io"],
        chainName: "Arbitrum One",
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        nativeCurrency: {
          name: "Arbitrum",
          symbol: "ETH",
          decimals: 18,
        },
      },
      421613: {
        chainId: ethers.utils.hexValue(421613),
        blockExplorerUrls: ["https://goerli.arbiscan.io/"],
        chainName: "Arbitrum Goerli",
        rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"],
        nativeCurrency: {
          name: "Arbitrum Goerli",
          symbol: "AETH",
          decimals: 18,
        },
      },
    },
  });
});
