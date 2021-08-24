# useWallet

<!-- ## Parameters -->

<!-- ### `target`

Target must be an element (**SVG** / **HTML**), or a reference to an element.

If the target **reference** is **updated**, the **current** style will be **updated** from the new **element** styling. -->

## Returns
### `isConnected: boolean`
### `provider:`[Web3Provider](https://docs.ethers.io/v5/api/providers/other/#Web3Provider)
### `connectError`
### `signer`
### `network`
### `address`
### `balance`
### `loadError`
### `connect`
### `disconnect`
### `updateBalance`
### `signTransaction`
### `signMessage`
### `signTypedData`
### `chainId`
### `error`
### `fixedBalance`

## Example

```typescript
const { connect, address, isConnected, disconnect } = useWallet()

const connectMetamask = async () => {
  await connect(Wallet.metamask)
}
```
