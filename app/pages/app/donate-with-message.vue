<script setup lang="ts">
import { ethers, formatUnits, getAddress, hexlify, isAddress, toUtf8Bytes } from 'ethers'
import ConnectButton from '~/components/button/ConnectButton.vue'
import type { Chain } from '~/utils/chains'

const chainId = ref(1)
const isTestnet = ref(true)

watch(
	isTestnet,
	() => {
		if (isTestnet.value) chainId.value = 11155111
		else chainId.value = 1
	},
	{
		immediate: true,
	},
)

const supportedChainId = computed(() => {
	if (isTestnet.value) return [11155111, 421614]
	return [1, 42161]
})

const supportedChain = computed(() => supportedChainId.value.map((id: number) => chains[id]).filter(Boolean))
const chain = computed(() => supportedChain.value.find(c => c.chainId === chainId.value))

const chainOptions = computed(() =>
	supportedChain.value.map((chain: Chain) => ({ label: chain.chainName, value: chain.chainId })),
)

const message = ref('')

const characters = computed(() => toUtf8Bytes(message.value).length)
const defaultProvider = computed(() => {
	const chain = supportedChain.value.find(c => c.chainId === chainId.value)
	return chain ? new ethers.JsonRpcProvider(chain.rpcUrls[0]) : null
})

const maxFeePerGas = ref(BigInt(0))
const loadingFee = ref(false)

watch(
	chainId,
	async () => {
		loadingFee.value = true
		try {
			const feeData = await defaultProvider.value!.getFeeData()
			maxFeePerGas.value = feeData.maxFeePerGas || BigInt(0)
		} catch (err: any) {
			error.value = err.message
		} finally {
			loadingFee.value = false
		}
	},
	{
		immediate: true,
	},
)

// ======================== Wallet ========================

const error = ref(null)
const loading = ref(false)
const { connector, isConnected, wallet, error: connectError } = useVueDapp()
const showSwitchButton = computed(() => isConnected.value && wallet.chainId !== chainId.value)
const isReady = computed(() => isConnected.value && !showSwitchButton.value)

async function switchChain() {
	try {
		const chain = supportedChain.value.find(c => c.chainId === chainId.value)
		await connector.value?.switchChain?.(chainId.value, chain)
	} catch (err: any) {
		error.value = err.message
	}
}

// ======================== Transaction ========================

const toAddress = ref('0x96A4715280c3Dac3F3093d51aA278aA5eb60ffDE')
const isAddressError = computed(() => !isAddress(toAddress.value))
const amount = ref(0)
const txHash = ref<string | null>(null)
const receipt = ref<ethers.TransactionReceipt | null>(null)

async function sendTransaction() {
	error.value = null
	txHash.value = null
	receipt.value = null

	try {
		loading.value = true

		if (!isConnected.value) throw new Error('please connect your wallet first.')
		if (isAddressError.value) throw new Error('Invalid address')

		const { signer } = useEthers()
		const transaction = {
			to: toAddress.value,
			value: amount.value,
			data: hexlify(toUtf8Bytes(message.value)),
		}

		const tx = await signer.value!.sendTransaction(transaction)
		txHash.value = tx.hash
		const _receipt = await tx.wait()

		receipt.value = _receipt
	} catch (err: any) {
		error.value = err.message
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="p-5 flex flex-col gap-5 max-w-[600px] mx-auto">
		<div class="text-2xl">Donate with Message</div>
		<div class="flex flex-col gap-2">
			<div class="flex gap-2 items-center">
				<div>Testnet</div>
				<n-switch v-model:value="isTestnet" />
			</div>

			<n-select v-model:value="chainId" :options="chainOptions" />

			<div>
				<n-input v-model:value="message" type="textarea" placeholder="Write your message here" />
				<div>Characters: {{ characters }}</div>
				<div v-if="chainId === 1 || chainId === 11155111">
					<div>Estimated Gas: {{ 21000 + 16 * characters }} wei</div>
					<div>
						Estimated Fee:
						{{
							loadingFee
								? 'loading...'
								: Number(formatUnits(maxFeePerGas * BigInt(21000 + 16 * characters), 'gwei')).toFixed(
										0,
									) + ' gwei'
						}}
					</div>
				</div>
			</div>

			<!-- To Address -->
			<n-input
				v-model:value="toAddress"
				:status="isAddressError ? 'error' : ''"
				type="text"
				placeholder="To address"
			/>

			<!-- Amount -->
			<n-input-number v-model:value="amount" :min="0" />

			<!-- Send button -->
			<n-button v-if="isReady" type="primary" :loading="loading" @click="sendTransaction"> Send </n-button>

			<!-- Error -->
			<div v-if="error || connectError" class="text-red-500">{{ error || connectError }}</div>

			<ConnectButton />

			<!-- Switch button -->
			<div class="flex gap-2">
				<n-button
					v-if="showSwitchButton"
					type="warning"
					ghost
					size="medium"
					:loading="loading"
					@click="switchChain"
				>
					Switch to {{ chainOptions.find(o => o.value === chainId)?.label }}
				</n-button>
			</div>

			<div v-if="txHash">
				<div class="text-xl">Transaction Hash</div>
				<a :href="chain?.blockExplorerUrls[0] + 'tx/' + txHash" target="_blank">{{ txHash }}</a>
			</div>

			<div v-if="receipt">
				<div class="text-xl">Receipt</div>
				<div>Gas Used: {{ receipt.gasUsed + ' wei' }}</div>
				<div>Fee: {{ formatUnits(receipt.fee, 'gwei') + ' gwei' }}</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
:deep(.n-select) {
	width: 170px;
}
</style>
