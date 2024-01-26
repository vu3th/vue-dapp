<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Modal from './Modal.vue'
import WalletConnectIcon from './logos/WalletConnect.vue'
import CoinbaseWalletIcon from './logos/CoinbaseWallet.vue'
// import GnosisSafeIcon from './logos/GnosisSafe.vue'
import { useVueDapp, ConnectorName, RDNS } from '@vue-dapp/core'
import { useBoardStore } from '../useBoardStore'

const props = withDefaults(
	defineProps<{
		dark?: boolean
		autoConnect?: boolean
		connectTimeout?: number
		autoConnectMetamaskIfSolo?: boolean
		connectErrorHandler?: (err: any) => void
		autoConnectErrorHandler?: (err: any) => void
	}>(),
	{
		dark: false,
		autoConnect: false,
		connectTimeout: 0,
		autoConnectMetamaskIfSolo: false,
		connectErrorHandler: () => {},
		autoConnectErrorHandler: () => {},
	},
)

const boardStore = useBoardStore()

const isAutoConnecting = ref(false)
const isAutoConnect = props.autoConnect
const connectTimeout = props.connectTimeout

// ==================== useVueDapp ====================

const { connectTo, autoConnect, status, providerDetails, hasConnector } = useVueDapp()

onMounted(async () => {
	if (isAutoConnect) {
		try {
			isAutoConnecting.value = true
			await autoConnect()
		} catch (err: any) {
			props.autoConnectErrorHandler && props.autoConnectErrorHandler(err)
		} finally {
			isAutoConnecting.value = false
		}
	}
})

// feat: autoconnect metaMask if it's the only connector
// watch(boardOpen, async () => {
// 	if (props.autoConnectMetamaskIfSolo && boardOpen.value) {
// 		if (connectors.length === 1 && connectors[0].name === 'metaMask') {
// 			await onClickWallet(connectors[0])
// 		}
// 	}
// })

const onClickWallet = async (connName: ConnectorName, rdns?: RDNS | string) => {
	try {
		boardStore.close()
		await connectTo(connName, { rdns })
	} catch (err: any) {
		props.connectErrorHandler && props.connectErrorHandler(err)
	}
}

const vClickOutside = {
	beforeMount: (el: any, binding: any) => {
		el.clickOutsideEvent = (event: MouseEvent) => {
			event.stopPropagation()

			if (event.target !== el && !el.contains(event.target)) {
				binding.value(event)
			}
		}
		const clickHandler = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
		setTimeout(() => {
			document.addEventListener(clickHandler, el.clickOutsideEvent)
		}, 0)
	},
	unmounted: (el: any) => {
		const clickOutsideEvent = el.clickOutsideEvent
		delete el.clickOutsideEvent
		const clickHandler = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
		document.removeEventListener(clickHandler, clickOutsideEvent)
	},
}
</script>

<template>
	<div>
		<Modal :modalOpen="boardStore.boardOpen" @close="boardStore.close" :dark="dark">
			<div v-click-outside="boardStore.close">
				<div v-for="detail in providerDetails" :key="detail.info.uuid">
					<div
						@click="onClickWallet('BrowserWallet', detail.info.rdns)"
						:class="dark ? 'wallet-item--dark' : 'wallet-item'"
					>
						<div class="item">
							<div class="logo">
								<!-- why the following will cause the error? -->
								<!-- <img
									style="width: 30px; height: 30px"
									:src="detail.info.icon"
									:alt="detail.info.name"
								/> -->
							</div>

							<div>{{ detail.info.name }}</div>
							<div :class="dark ? 'line--dark' : 'line'"></div>
						</div>
					</div>
				</div>

				<div
					v-if="hasConnector('WalletConnect')"
					@click="onClickWallet('WalletConnect')"
					:class="dark ? 'wallet-item--dark' : 'wallet-item'"
				>
					<div class="item">
						<WalletConnectIcon class="logo" />
						<div>WalletConnect</div>
					</div>
				</div>

				<div
					v-if="hasConnector('CoinbaseWallet')"
					@click="onClickWallet('CoinbaseWallet')"
					:class="dark ? 'wallet-item--dark' : 'wallet-item'"
				>
					<div class="item">
						<CoinbaseWalletIcon class="logo" />
						<div>Coinbase Wallet</div>
					</div>
				</div>
			</div>
		</Modal>

		<slot name="connecting">
			<Modal :modalOpen="status === 'connecting' && !isAutoConnecting" :dark="dark">
				<div class="loading-modal" v-if="status === 'connecting'">
					<p>Connecting...</p>
					<p class="mt-4">Approve or reject request using your wallet</p>
				</div>
			</Modal>
		</slot>
	</div>
</template>

<style scoped>
.wallet-item {
	display: flex;
	justify-content: center;
	padding: 1rem 1rem 0.6rem;
	margin: 0.5rem;
	border-radius: 0.75rem;
	cursor: pointer;
}

.wallet-item:hover {
	background-color: rgba(236, 237, 239, 0.737);
}

/* dark mode */
.wallet-item--dark {
	display: flex;
	justify-content: center;
	padding: 1rem 1rem 0.6rem;
	margin: 0.5rem;
	border-radius: 0.75rem;
	cursor: pointer;
	color: rgb(199, 199, 199);
}

.wallet-item--dark:hover {
	background-color: #101a20;
}

@media (min-width: 640px) {
	.wallet-item {
		width: 24rem;
	}
	.wallet-item--dark {
		width: 24rem;
	}
}

.item {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-size: 1.5rem;
	line-height: 2rem;
}

.item > :not([hidden]) ~ :not([hidden]) {
	margin-top: 1rem;
	margin-bottom: 1rem;
}

.line {
	border-color: #e5e7eb;
	border-width: 0px;
	border-bottom-width: 1px;
	border-style: solid;
}

.line--dark {
	border-color: rgba(195, 195, 195, 0.14);
	border-width: 0px;
	border-bottom-width: 1px;
	border-style: solid;
}

.logo {
	display: flex;
	align-items: center;
	width: 50px;
	height: 50px;
}

.wallet-disabled {
	opacity: 0.5;
}

.wallet-disabled:hover {
	background-color: rgba(255, 255, 255, 0);
	cursor: default;
}

.loading-modal {
	width: 20rem;
	padding: 2.5rem;
	text-align: center;
}

.loading-modal > p:first-child {
	font-size: 1.25rem;
	line-height: 1.75rem;
}

@media (min-width: 640px) {
	.loading-modal {
		width: auto;
	}
}
</style>
