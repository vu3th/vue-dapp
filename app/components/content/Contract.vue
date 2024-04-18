<script setup lang="ts">
import ConnectButton from '@/components/button/ConnectButton.vue'
import type { ConnWallet } from '@vue-dapp/core'
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

// ======================== Wallet ========================

const { isConnected, chainId, error: ConnectError, onConnected } = useVueDapp()

let signer: ethers.Signer | null = null

onConnected(async (wallet: ConnWallet) => {
	const provider = new ethers.BrowserProvider(wallet.provider)
	signer = await provider.getSigner()
})

onMounted(() => {
	fetchData()
})

// ======================== Contract Read ========================
const error = ref(null)
const currentNum = ref(0)
const loading = ref(false)

async function fetchData() {
	error.value = null
	try {
		loading.value = true
		const contract = new ethers.Contract(contractAddress, iface, defaultProvider)
		const data = Number(await contract.retrieve())
		currentNum.value = data
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

		if (!signer) {
			throw new Error('Signer is not ready')
		}

		const contract = new ethers.Contract(contractAddress, iface, signer)
		const tx = await contract.store(newNum.value)
		await tx.wait()
		await fetchData()
	} catch (err: any) {
		error.value = err.message
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

// ======================== Computed ========================

const showSwitchButton = computed(() => isConnected.value && chainId.value !== supportedChainId)
const isReady = computed(() => isConnected.value && !showSwitchButton.value)
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="flex flex-col gap-2">
			<div>Current Number: {{ loading ? 'loading...' : currentNum }}</div>
			<div class="flex gap-2">
				<n-input-number v-model:value="newNum" min="0" class="w-32" />
				<n-button
					v-if="isReady"
					:disabled="currentNum === newNum"
					size="medium"
					:loading="waiting"
					@click="sendTransaction"
				>
					Send
				</n-button>
			</div>
		</div>

		<ConnectButton />

		<div class="flex gap-2">
			<n-button
				v-if="showSwitchButton"
				type="warning"
				ghost
				size="medium"
				:loading="waiting"
				@click="switchChain"
			>
				Switch to {{ supportedChainName }}
			</n-button>
		</div>

		<div class="text-red-500">{{ error || ConnectError }}</div>
	</div>
</template>

<style lang="scss"></style>
