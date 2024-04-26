<script setup lang="ts">
import { Contract, Interface, ethers, formatEther } from 'ethers'
import { MulticallProvider } from '@ethers-ext/provider-multicall'
import ConnectButton from '../button/ConnectButton.vue'
import type { ConnWallet } from '@vue-dapp/core'
import type { Header, Item } from 'vue3-easy-data-table'

const MAINNET_RPC = 'https://ethereum-rpc.publicnode.com'
const ARBITRUM_RPC = 'https://arbitrum-one-rpc.publicnode.com'

const MAINNET_DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const MAINNET_USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const MAINNET_AUSDC = '0xBcca60bB61934080951369a648Fb03DF4F96263C'
const ARBITRUM_DAI = '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
const ARBITRUM_USDC = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
const ARBITRUM_AUSDC = '0x724dc807b04555b71ed48a6896b6F41593b8C637'

const mainnetMulticaller = new MulticallProvider(new ethers.JsonRpcProvider(MAINNET_RPC))
const arbitrumMulticaller = new MulticallProvider(new ethers.JsonRpcProvider(ARBITRUM_RPC))

const iface = new Interface([
	'function name() public view returns (string memory)',
	'function symbol() view returns (string)',
	'function decimals() view returns (uint8)',
	'function balanceOf(address owner) view returns (uint256)',
])

const mainnetDai = new Contract(MAINNET_DAI, iface, mainnetMulticaller)
const mainnetUsdc = new Contract(MAINNET_USDC, iface, mainnetMulticaller)
const mainnetAusdc = new Contract(MAINNET_AUSDC, iface, mainnetMulticaller)
const arbitrumDai = new Contract(ARBITRUM_DAI, iface, arbitrumMulticaller)
const arbitrumUsdc = new Contract(ARBITRUM_USDC, iface, arbitrumMulticaller)
const arbitrumAusdc = new Contract(ARBITRUM_AUSDC, iface, arbitrumMulticaller)

async function fetchMainnetData() {
	return await Promise.all([
		mainnetDai.name(),
		mainnetDai.symbol(),
		mainnetDai.decimals(),
		mainnetUsdc.name(),
		mainnetUsdc.symbol(),
		mainnetUsdc.decimals(),
		mainnetAusdc.name(),
		mainnetAusdc.symbol(),
		mainnetAusdc.decimals(),
	])
}

async function fetchArbitrumData() {
	return await Promise.all([
		arbitrumDai.name(),
		arbitrumDai.symbol(),
		arbitrumDai.decimals(),
		arbitrumUsdc.name(),
		arbitrumUsdc.symbol(),
		arbitrumUsdc.decimals(),
		arbitrumAusdc.name(),
		arbitrumAusdc.symbol(),
		arbitrumAusdc.decimals(),
	])
}

const { data: mainnetData } = useAsyncData('mainnet', () => fetchMainnetData())
const { data: arbitrumDaiData } = useAsyncData('arbitrum', () => fetchArbitrumData())

const tokenList = computed(() => {
	function sliceData(data: any) {
		if (!data) return []
		return [data.slice(0, 3), data.slice(3, 6), data.slice(6, 9)]
	}

	return {
		mainnet: sliceData(mainnetData.value),
		arbitrum: sliceData(arbitrumDaiData.value),
	}
})

const balances = ref<{ mainnet: number[]; arbitrum: number[] }>({ mainnet: [], arbitrum: [] })

const { onWalletUpdated, onDisconnected } = useVueDapp()

onWalletUpdated(async (wallet: ConnWallet) => {
	const mainnetBalance = await Promise.all([
		mainnetDai.balanceOf(wallet.address),
		mainnetUsdc.balanceOf(wallet.address),
		mainnetAusdc.balanceOf(wallet.address),
	])
	const arbitrumBalance = await Promise.all([
		arbitrumDai.balanceOf(wallet.address),
		arbitrumUsdc.balanceOf(wallet.address),
		arbitrumAusdc.balanceOf(wallet.address),
	])
	balances.value = { mainnet: mainnetBalance, arbitrum: arbitrumBalance }
})

onDisconnected(() => {
	balances.value = { mainnet: [], arbitrum: [] }
})

const headers: Header[] = [
	{ text: 'Network', value: 'network' },
	{ text: 'Name', value: 'name' },
	{ text: 'Symbol', value: 'symbol' },
	{ text: 'Decimals', value: 'decimals' },
	{ text: 'Balance', value: 'balance' },
	// { text: 'Price', value: 'price' },
]

const items = computed<Item[]>(() => {
	const mainnetItems = tokenList.value.mainnet.map(([name, symbol, decimals], i) => ({
		network: 'Mainnet',
		name,
		symbol,
		decimals: Number(decimals),
		balance: formatEther(balances.value.mainnet[i] ?? 0),
	}))
	const arbitrumItems = tokenList.value.arbitrum.map(([name, symbol, decimals], i) => ({
		network: 'Arbitrum',
		name,
		symbol,
		decimals: Number(decimals),
		balance: formatEther(balances.value.arbitrum[i] ?? 0),
	}))
	return [...mainnetItems, ...arbitrumItems]
})
</script>

<template>
	<div class="flex flex-col gap-5">
		<ConnectButton />

		<ClientOnly>
			<Vue3EasyDataTable hide-rows-per-page hide-footer :headers="headers" :items="items"> </Vue3EasyDataTable>
		</ClientOnly>
	</div>
</template>

<style lang="scss"></style>
