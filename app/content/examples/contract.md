---
description: ''
head:
  meta:
    - name: 'keywords'
      content: 'vue-dapp, contract'
---

# Contract



::contract
::



## Reference
- Network: Arbitrum Sepolia
- Address: 0x4022Be091550EFB5dB2E5Ba93457ee69BF6e1aDA
- Source code: https://github.com/vu3th/vue-dapp/tree/main/app/components/content/Contract.vue

### Contract source code
```solidity
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Storage {

    uint256 number;

    event Updated(address indexed addr, uint256 num);

    function store(uint256 num) public {
        number = num;
        emit Updated(msg.sender, num);
    }

    function retrieve() public view returns (uint256){
        return number;
    }
}
```

### Foundry Cast to send the transaction

```bash
cast send --account dev \
  --rpc-url https://arbitrum-sepolia-rpc.publicnode.com \
	0x4022Be091550EFB5dB2E5Ba93457ee69BF6e1aDA \
	"function store(uint256 num)" \
	24
```