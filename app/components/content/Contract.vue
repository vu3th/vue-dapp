<script setup lang="ts">
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

// ======================== Computed ========================

const showSwitchButton = computed(() => isConnected.value && wallet.chainId !== supportedChainId)
const isReady = computed(() => isConnected.value && !showSwitchButton.value)
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="flex flex-col gap-2">
			<div>Current Number: {{ loading ? 'loading...' : currentNum }}</div>
			<div class="flex gap-2">
				<!-- Number Input -->
				<n-input-number v-model:value="newNum" min="0" class="w-32" />

				<!-- Send button -->
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

		<!-- Switch button -->
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

		<!-- Event logs -->
		<div>
			<p>Events</p>

			<n-skeleton v-if="eventLoading && !displayEvents.length" text :repeat="3" />
			<div v-else-if="!displayEvents.length" class="text-gray-500">
				<div>No event found in the last 40,000 blocks.</div>
				<NuxtLink
					external
					target="_blank"
					to="https://sepolia.arbiscan.io/address/0x4022Be091550EFB5dB2E5Ba93457ee69BF6e1aDA#events"
				>
					More on explorer
				</NuxtLink>
			</div>

			<n-list v-else class="p-0" hoverable bordered>
				<TransitionGroup name="list">
					<n-list-item class="p-0 m-0" v-for="event in displayEvents" :key="event.blockHash">
						{{
							`Number ${event.args['num']} updated by ${shortenAddress(event.args['addr'])} at ${event.blockNumber}`
						}}
					</n-list-item>
					<n-list-item class="p-0 m-0" key="0">
						<NuxtLink
							external
							target="_blank"
							to="https://sepolia.arbiscan.io/address/0x4022Be091550EFB5dB2E5Ba93457ee69BF6e1aDA#events"
						>
							More on explorer
						</NuxtLink>
					</n-list-item>
				</TransitionGroup>
			</n-list>
		</div>
	</div>
</template>

<style lang="scss" scoped>
// https://vuejs.org/guide/built-ins/transition-group.html#transitiongroup
.list-enter-active,
.list-leave-active {
	transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
</style>
