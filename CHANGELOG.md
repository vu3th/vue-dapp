# Changelog

## v0.4.6 (2021-12-9)

#### Features

- New logo from issue #24 (Special thank @ramuta for his contribution!)
- Add [Metamask switch chain API](https://github.com/chnejohnson/vue-dapp/blob/062acd4092b8f6a2a67af750f2569294c90c4f7b/src/wallets/metamask.ts#L47) and [network constants](https://github.com/chnejohnson/vue-dapp/blob/main/src/constants/chainId.ts)
- Update documentation to latest.
- Support connecting to Arbitrum, RinkArby, and Polygon with MetaMask

#### Fix

- Prevent page scrolling when the board is open
- Add error handling for useWallet `subscribeChainChanged`

## v0.4.5 (2021-11-19)

#### Fix

- issue #20: Successfully serve with production build in the Vite environment.

#### Features

- Support Coinbase Wallet. (Special thank @coxlr for his contribution!)

## v0.4.4 (2021-11-12)

#### Big Changes

- Remove vue-demi, so only support Vue 3
- Add @walletconnect/web3-provider, so no longer needed WalletConnect CDN in `index.html`
- Target changed into es2015 in `tsconfig.json` for compiling optional chaining

#### Features

- Support Vue CLI (#17)

## v0.4.2 (2021-09-17)

- fix some bugs

## v0.4.1 (2021-09-15)

#### Big Changes

- Change <board> with <vdapp-board>
- Register component <vdapp-modal>

#### Features

- Add useMulticall
- Add useToken
- Add useEthersHooks

#### Others

- Refactor
- improve UX

## v0.4.0 (2021-09-05)

#### Big Changes

- WalletConnect available
- Refactor with `useWallet` and `useEthers`
- Remove `useMetamask`, using class `MetaMask` and `WalletConnect`
- Remove vue-composable by custom `v-click-outside` directive

## v0.3.0 (2021-08-28)

- Component library available
- `useMetamask` add provider event

## v0.2.0 (2021-08-24)

- Simple metamask available
