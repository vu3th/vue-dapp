<script setup lang="ts">
import { useWalletStore } from '@vue-dapp/core'

const walletStore = useWalletStore()

function onClickAddERC20Token() {
	if (!walletStore.connector) {
		console.error('Wallet not connected')
		return
	}
	walletStore.connector.addERC20Token({
		address: '0x62007926Be28A1bB408a82548D17b90E4e6988BE',
		symbol: 'ABC',
		decimals: 18,
	})
}
</script>

<template>
	<div class="flex flex-col items-center p-5 gap-2">
		<BaseButton @click="onClickAddERC20Token">Add ERC20 Token</BaseButton>
	</div>
</template>

<style lang="scss"></style>
