## [0.7.2](https://github.com/vu3th/vue-dapp/compare/v0.7.1...v0.7.2) (2023-01-29)


### Bug Fixes

* autoConnect not working in Firefox ([5b0af51](https://github.com/vu3th/vue-dapp/commit/5b0af513c93a34ca261fb6175a02db478bba5a61))

## [0.7.1](https://github.com/vu3th/vue-dapp/compare/v0.7.0...v0.7.1) (2022-12-22)


### Bug Fixes

* gnosis safe dynamic import error, and rename localStorage item name ([d7750d0](https://github.com/vu3th/vue-dapp/commit/d7750d083ef675b1c2288fb3d78ce41c3c1a9454))

# [0.7.0](https://github.com/vu3th/vue-dapp/compare/v0.6.4...v0.7.0) (2022-12-22)


### Features

* optional peer dependencies with dynamic import to provide opt-in wallet provider modules to install ([d4cb831](https://github.com/vu3th/vue-dapp/commit/d4cb831f5c597d578eb090757e73db4fe45d6422))

## [0.6.4](https://github.com/vu3th/vue-dapp/compare/v0.6.3...v0.6.4) (2022-12-22)


### Bug Fixes

* remove console.error, and add error handler property on vd-board ([5028f30](https://github.com/vu3th/vue-dapp/commit/5028f30dbe523dbdf7b314fc5a5f8fcd3301a96c))

## [0.6.3](https://github.com/vu3th/vue-dapp/compare/v0.6.2...v0.6.3) (2022-12-22)


### Bug Fixes

* stay disconnected after clicking disconnect and refreshing page, close [#104](https://github.com/vu3th/vue-dapp/issues/104), [#62](https://github.com/vu3th/vue-dapp/issues/62) ([7ae9f40](https://github.com/vu3th/vue-dapp/commit/7ae9f408adddd897abb86e4d559a0f41645234e1))

## [0.6.2](https://github.com/vu3th/vue-dapp/compare/v0.6.1...v0.6.2) (2022-11-18)


### Bug Fixes

* uncaught type error when not providing plugin options ([e9d0d2e](https://github.com/vu3th/vue-dapp/commit/e9d0d2e0c728020a41b5c4162b4a000a8878c81f))

## [0.6.1](https://github.com/vu3th/vue-dapp/compare/v0.6.0...v0.6.1) (2022-11-05)


### Bug Fixes

* auto-connect with gnosis safe ([05c1f3c](https://github.com/vu3th/vue-dapp/commit/05c1f3cb0dd3256224300d8e745e7278ddfed9c4))
* refactor autoConnect and export isNotSafeApp for users to conditionally include the connector or not ([59d5e26](https://github.com/vu3th/vue-dapp/commit/59d5e2674eae067d76e94b77046881ade9720037))

# [0.6.0](https://github.com/vu3th/vue-dapp/compare/v0.5.9...v0.6.0) (2022-10-23)


### Features

* automatically load MetaMask wallet, close [#80](https://github.com/vu3th/vue-dapp/issues/80) ([69c17ee](https://github.com/vu3th/vue-dapp/commit/69c17ee91a53ff6780d66da8ba4351d9700e531c))

## [0.5.9](https://github.com/vu3th/vue-dapp/compare/v0.5.8...v0.5.9) (2022-10-21)


### Bug Fixes

* watch isActivated for the onActivatedHook ([dcf0c9a](https://github.com/vu3th/vue-dapp/commit/dcf0c9a2f83013a47c149d739742fa05ecbbbde2))

## [0.5.8](https://github.com/vu3th/vue-dapp/compare/v0.5.7...v0.5.8) (2022-08-24)


### Bug Fixes

* wallet status error, resolve [#77](https://github.com/vu3th/vue-dapp/issues/77) ([b675187](https://github.com/vu3th/vue-dapp/commit/b675187ea9b120a4ed9e1bd86a883711a695b52e))

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
- Add [Metamask switch chain API](https://github.com/vu3th/vue-dapp/blob/062acd4092b8f6a2a67af750f2569294c90c4f7b/src/connectors/metamask.ts#L47) and [network constants](https://github.com/vu3th/vue-dapp/blob/main/src/constants/chainId.ts)
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
