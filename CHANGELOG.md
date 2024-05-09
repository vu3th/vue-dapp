# CHANGELOG

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