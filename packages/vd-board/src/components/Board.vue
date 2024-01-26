<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Modal from './Modal.vue'
import WalletConnectIcon from './logos/WalletConnectIcon.vue'
import CoinbaseWalletIcon from './logos/CoinbaseWalletIcon.vue'
// import GnosisSafeIcon from './logos/GnosisSafeIcon.vue'
import { useVueDapp, ConnectorName, RDNS } from '@vue-dapp/core'

// const coinbaseWalletIconSrc =
// 	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI4IDU2YzE1LjQ2NCAwIDI4LTEyLjUzNiAyOC0yOFM0My40NjQgMCAyOCAwIDAgMTIuNTM2IDAgMjhzMTIuNTM2IDI4IDI4IDI4WiIgZmlsbD0iIzFCNTNFNCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNyAyOGMwIDExLjU5OCA5LjQwMiAyMSAyMSAyMXMyMS05LjQwMiAyMS0yMVMzOS41OTggNyAyOCA3IDcgMTYuNDAyIDcgMjhabTE3LjIzNC02Ljc2NmEzIDMgMCAwIDAtMyAzdjcuNTMzYTMgMyAwIDAgMCAzIDNoNy41MzNhMyAzIDAgMCAwIDMtM3YtNy41MzNhMyAzIDAgMCAwLTMtM2gtNy41MzNaIiBmaWxsPSIjZmZmIi8+PC9zdmc+'

const props = withDefaults(
	defineProps<{
		modelValue: boolean
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
		connectErrorHandler: undefined,
		autoConnectErrorHandler: undefined,
	},
)

const emit = defineEmits(['update:modelValue'])

function closeModal() {
	emit('update:modelValue', false)
}

const isAutoConnecting = ref(false)
const isAutoConnect = props.autoConnect
const connectTimeout = props.connectTimeout

// ==================== useVueDapp ====================

const { connectTo, autoConnect, status, providerDetails, hasConnector } = useVueDapp()

watch(status, () => {
	console.log('Board.status', status.value)
})

onMounted(async () => {
	if (isAutoConnect) {
		try {
			isAutoConnecting.value = true
			await autoConnect()
		} catch (err: any) {
			if (props.autoConnectErrorHandler) {
				props.autoConnectErrorHandler(err)
			} else {
				console.error('VueDappError:', err)
			}
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
		closeModal()
		await connectTo(connName, { rdns })
	} catch (err: any) {
		if (props.connectErrorHandler) {
			props.connectErrorHandler(err)
		} else {
			console.error('VueDappError:', err)
		}
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
		<Modal :modalOpen="modelValue" @close="closeModal" :dark="dark">
			<div id="the-board" v-click-outside="closeModal">
				<div
					v-for="detail in providerDetails"
					:key="detail.info.uuid"
					@click="onClickWallet('BrowserWallet', detail.info.rdns)"
					class="wallet-block"
					:class="{
						'wallet-block--dark': dark,
					}"
				>
					<div class="logo">
						<img :src="detail.info.icon" :alt="detail.info.name" />
					</div>

					<div>{{ detail.info.name }}</div>
					<!-- <div :class="dark ? 'line--dark' : 'line'"></div> -->
				</div>

				<div
					v-if="hasConnector('WalletConnect')"
					@click="onClickWallet('WalletConnect')"
					class="wallet-block"
					:class="{
						'wallet-block--dark': dark,
					}"
				>
					<WalletConnectIcon class="logo" />
					<div>WalletConnect</div>
				</div>

				<div
					v-if="hasConnector('CoinbaseWallet')"
					@click="onClickWallet('CoinbaseWallet')"
					class="wallet-block"
					:class="{
						'wallet-block--dark': dark,
					}"
				>
					<CoinbaseWalletIcon class="logo" />
					<!-- <img class="logo" :src="coinbaseWalletIconSrc" alt="Coinbase Wallet" /> -->
					<div>Coinbase Wallet</div>
				</div>
			</div>
		</Modal>

		<slot name="connecting">
			<Modal :modalOpen="status === 'connecting' && !isAutoConnecting" dark>
				<div class="loading-modal" v-if="status === 'connecting'">
					<p>Connecting...</p>
					<p class="mt-4">Approve or reject request using your wallet</p>

					<!-- fucking problem when using the following code -->
					<!-- <button
						class="cancel-btn"
						:class="{
							'cancel-btn--dark': dark,
						}"
						@click="closeModal"
					>
						Cancel
					</button> -->
				</div>
			</Modal>
		</slot>
	</div>
</template>

<style scoped>
#the-board {
	width: 450px;
	height: auto;

	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 5px;
	padding: 15px 15px;
}

.wallet-block {
	padding: 10px 20px;

	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;

	border-radius: 0.75rem;
	cursor: pointer;
}

.wallet-block.wallet-block--dark:hover {
	background-color: #101a20;
}

.wallet-block:not(.wallet-block--dark):hover {
	background-color: rgba(236, 237, 239, 0.737);
}

.logo {
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
}

.loading-modal {
	width: 20rem;
	padding: 2.5rem;
	text-align: center;
}

/* title: connecting... */
.loading-modal > p:first-child {
	font-size: 1.25rem;
}

.cancel-btn {
	margin-top: 15px;

	width: auto;
	padding: 5px 15px;
	border: gray 1px solid;
	border-radius: 0.75rem;
}

.cancel-btn:not(.cancel-btn--dark):hover {
	background-color: #e5e7eb;
}

.cancel-btn.cancel-btn--dark:hover {
	border: #e5e7eb 1px solid;
	background: #101a20;
}

@media (max-width: 460px) {
	#the-board {
		width: 95vw;
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}
	.wallet-item {
		width: 24rem;
	}
	.wallet-item--dark {
		width: 24rem;
	}

	.loading-modal {
		width: 95vw;
		padding: 1.5rem 5px;
	}

	.loading-modal > p:first-child {
		font-size: 1rem;
	}
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

.wallet-disabled {
	opacity: 0.5;
}

.wallet-disabled:hover {
	background-color: rgba(255, 255, 255, 0);
	cursor: default;
}
</style>
