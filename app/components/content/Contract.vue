<script setup lang="ts">
import ConnectButton from '@/components/button/ConnectButton.vue'
import { Interface, ethers } from 'ethers'

const defaultProvider = new ethers.JsonRpcProvider('https://arbitrum-sepolia-rpc.publicnode.com')
const supportedChainId = 421614
const supportedChainName = 'Arbitrum Sepolia'

const ethersStore = useEthersStore()

// ======================== Contract ========================
const contractAddress = '0x4022Be091550EFB5dB2E5Ba93457ee69BF6e1aDA'

const iface = new Interface([
	'function retrieve() public view returns (uint256)',
	'function store(uint256 num)',
	'event Updated(address indexed addr, uint256 num)',
])

// ======================== State ========================

const { isConnected, chainId } = useVueDapp()

const { data: currentNum, pending, error: fetchError, refresh } = await useAsyncData('retrieve', () => fetchData())

const waiting = ref(false)
const newNum = ref(currentNum.value || 0)
const error = ref(null)

// ======================== Contract Read ========================
async function fetchData() {
	const contract = new ethers.Contract(contractAddress, iface, defaultProvider)
	return Number(await contract.retrieve())
}

// ======================== Contract Write ========================
async function sendTransaction() {
	try {
		waiting.value = true
		const contract = new ethers.Contract(contractAddress, iface, ethersStore.signer)
		const tx = await contract.store(newNum.value)
		await tx.wait()
	} catch (err: any) {
		error.value = err.message
	} finally {
		waiting.value = false
		refresh()
	}
}

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

const showSwitchButton = computed(() => isConnected.value && chainId.value !== supportedChainId)
const isReady = computed(() => isConnected.value && !showSwitchButton.value)
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="flex flex-col gap-2">
			<div>Current Value: {{ pending ? 'loading...' : currentNum }}</div>
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

		<div class="text-red-500">{{ error || fetchError }}</div>
	</div>
</template>

<style lang="scss"></style>
