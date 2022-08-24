# Changelog

## v0.5.7 (2022-8-24)
- fix: metamask can't clone reactive object

## v0.5.6 (2022-8-23)

- feat: make chain list extendable #59 (by @re2005)

## v0.5.5 (2022-8-16)
- Fix update wallet balance interval to avoid errors when changing networks #72 #74

## v0.5.4 (2022-8-7)

- refactor: clean up chain names & urls #56
- fix: issue #57 metamask network change #57
- feat: autoupdate balance every 10 seconds #63
- feat: add ens support #65
- fix: avoid uncaught error when user closes the WalletConnect QR modal #69

Special thanks to @re2005 and @Mulander-J for their contributions!

## v0.5.3 (2022-6-14)

#### Feature
- Add networks, see #50 (Thanks to @re2005's contribution!)

#### Fix
- Update MeteMask to MetaMask, close #49

## v0.5.2 (2022-5-27)
#### Fix

- Catch error if walletConnect not connected because of invalid infura id, close #27

## v0.5.1 (2022-5-26)
#### Breaking changes

- Refactor architecture with Connector classes
- Upgrade Coinbase Wallet dependencies, close #42
- Rename `<vdapp-board>` into `<vd-board>`
- Support custom provider options, close #39, #23
- Support dark mode board

## v0.4.9-beta.0 (2022-3-8)
#### Features

- Add Call hook, see PR #40 (Thanks to @kjpou1's contribution!)

## v0.4.8 (2022-3-3)
#### Fix

- Reduce multi provider, solved issue #30 #36. Thanks @Mulander-J for his contribution!

## v0.4.7 (2022-1-16)
#### Fix

- Add deep link to MetaMask wallet on mobile device, solved issue #26 (Thank @coxlr for his contribution!)

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

- Change \<board> with \<vdapp-board>
- Register component \<vdapp-modal>

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
