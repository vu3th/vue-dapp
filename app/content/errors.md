---
description: ''
head:
  meta:
    - name: 'keywords'
      content: ''
---

#  Errors

## Provider Errors

- [EIP-1193 Provider Errors](https://eips.ethereum.org/EIPS/eip-1193#provider-errors){:target="_blank"}

| Status code | Name                  | Description                                                              |
| ----------- | --------------------- | ------------------------------------------------------------------------ |
| 4001        | User Rejected Request | The user rejected the request.                                           |
| 4100        | Unauthorized          | The requested method and/or account has not been authorized by the user. |
| 4200        | Unsupported Method    | The Provider does not support the requested method.                      |
| 4900        | Disconnected          | The Provider is disconnected from all chains.                            |
| 4901        | Chain Disconnected    | The Provider is not connected to the requested chain.                    |


## Developing Common Errors

- ["getActivePinia()" was called but there was no active Pinia.](https://github.com/vu3th/vue-dapp/issues/160){:target="_blank"}

