# CHANGELOG


## v1.5.0

- Fix modal style on mobile
- Fix hot reload issue in dev mode when importing walletconnect or coinbase. issue #162 pr #187
- Fix `connectTo` error handling pr #188


## v1.4.3
- Update `shortenAddress`

```ts
test('shortenAddress', () => {
	expect(shortenAddress('0x9D75F4EbcB8e7669E59dcc27CBadC698E0F77187')).toBe('0x9D75...7187')
})

test('shortenAddress with custom start and end length', () => {
	expect(shortenAddress('0x9D75F4EbcB8e7669E59dcc27CBadC698E0F77187', 8, 5)).toBe('0x9D75F4...77187')
})

test('shortenAddress with invalid address', () => {
	expect(shortenAddress('')).toBe('')
	expect(shortenAddress(null as any)).toBe('')
	expect(shortenAddress(undefined as any)).toBe('')
})
```

## v1.4.2
- Feat: Don't auto-connect to MetaMask if it's locked #185

## v1.4.1
- Fix VueDappModal styles

## v1.4.0
- Document add Listeners in https://vuedapp.xyz/overview
- Rename listeners
```
onConnected -> watchConnected
onAccountOrChainIdChanged -> watchAddressChainIdChanged
onWalletUpdated,watchConnect -> watchWalletChanged
onDisconnected -> watchDisconnect
```

- Add new listeners
```
watchAddressChanged
watchChainIdChanged
```
- Fix VueDappModal styles

## v1.3.3
- export `useAutoConnect`