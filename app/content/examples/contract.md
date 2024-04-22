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

## Source code of this page

- [source code link](https://github.com/vu3th/vue-dapp/tree/main/app/components/content/Contract.vue){:target="_blank"}

```ts
import ConnectButton from '@/components/button/ConnectButton.vue'
import { shortenAddress, useVueDapp } from '@vue-dapp/core'
import { Interface, ethers } from 'ethers'

const defaultProvider = new ethers.JsonRpcProvider('https://arbitrum-sepolia-rpc.publicnode.com')
const supportedChainId = 421614
const supportedChainName = 'Arbitrum Sepolia'

// ======================== Contract ========================
const contractAddress = '0x4022Be091550EFB5dB2E5Ba93457ee69BF6e1aDA'

const iface = new Interface([
	'function retrieve() public view returns (uint256)',
	'function store(uint256 num)',
	'event Updated(address indexed addr, uint256 num)',
])

const contract = new ethers.Contract(contractAddress, iface, defaultProvider)

// ======================== Wallet ========================

const { isConnected, wallet, error: ConnectError } = useVueDapp()

onMounted(() => {
	fetchData()
	fetchEventLogs()

	// listen to events
	contract.on('Updated', (_addr, _num) => {
		fetchEventLogs()
	})
})

onUnmounted(() => {
	contract.removeAllListeners()
})

// ======================== Contract Read ========================
const error = ref(null)
const currentNum = ref(0)
const loading = ref(false)

async function fetchData() {
	error.value = null
	try {
		loading.value = true
		const data = Number(await contract.retrieve())
		currentNum.value = data
		newNum.value = data
		return data
	} catch (err: any) {
		error.value = err.message
	} finally {
		loading.value = false
	}
}

// ======================== Contract Write ========================
const newNum = ref(0)
const waiting = ref(false)

async function sendTransaction() {
	error.value = null

	try {
		waiting.value = true

		if (!isConnected.value) throw new Error('please connect your wallet first.')

		const provider = new ethers.BrowserProvider(wallet.provider!)
		const signer = await provider.getSigner()
		const tx = await (contract.connect(signer) as ethers.Contract).store(newNum.value)
		await tx.wait()

		fetchData()
		fetchEventLogs()
	} catch (err: any) {
		error.value = err
	} finally {
		waiting.value = false
	}
}

// ======================== Switch Chain ========================

async function switchChain() {
	const { connector } = useVueDapp()
	try {
		await connector.value?.switchChain?.(421614, {
			chainId: 421614,
			chainName: 'Arbitrum Sepolia',
			nativeCurrency: {
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: ['https://arbitrum-sepolia-rpc.publicnode.com/'],
			blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
		})
	} catch (err: any) {
		error.value = err.message
	}
}

// ======================== Events ========================
const events = ref<ethers.EventLog[]>([])
const eventLoading = ref(false)

const displayEvents = computed(() => events.value.slice().reverse().slice(0, 3))

async function fetchEventLogs() {
	try {
		eventLoading.value = true

		// https://github.com/ethers-io/ethers.js/discussions/1816
		events.value = (await contract.queryFilter(contract.filters.Updated, -40000)) as ethers.EventLog[]
		console.log('events', events.value)
	} catch (err: any) {
		error.value = err.message
	} finally {
		eventLoading.value = false
	}
}
```

### Contract source code

- Network: Arbitrum Sepolia
- Address: 0x4022Be091550EFB5dB2E5Ba93457ee69BF6e1aDA


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