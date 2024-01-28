<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Modal from './components/Modal.vue'
import WalletConnectIcon from './components/logos/WalletConnectIcon.vue'
import { useVueDapp, ConnectorName, RDNS } from '@vue-dapp/core'

const props = withDefaults(
	defineProps<{
		modelValue: boolean
		dark?: boolean
		autoConnect?: boolean
		connectTimeout?: number
		autoConnectBrowserWalletIfSolo?: boolean
		connectErrorHandler?: (err: any) => void
		autoConnectErrorHandler?: (err: any) => void
	}>(),
	{
		dark: false,
		autoConnect: false,
		connectTimeout: 0,
		autoConnectBrowserWalletIfSolo: false,
		connectErrorHandler: undefined,
		autoConnectErrorHandler: undefined,
	},
)

const emit = defineEmits(['update:modelValue'])

function closeModal() {
	emit('update:modelValue', false)
}

const isAutoConnecting = ref(false)

const { connectors, connectTo, autoConnect, status, providerDetails, hasConnector, disconnect } = useVueDapp()

// ============================ feat: autoConnect ============================

async function handleAutoConnect() {
	if (props.autoConnect) {
		try {
			isAutoConnecting.value = true
			await autoConnect(RDNS.metamask)
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
}

onMounted(async () => handleAutoConnect())

// ============================ feat: auto click BrowserWallet if it's the only connector ============================
watch(
	() => props.modelValue,
	async () => {
		if (props.autoConnectBrowserWalletIfSolo && props.modelValue) {
			if (
				connectors.value.length === 1 && // only one connector
				providerDetails.value.length === 1 && // only one browser provider
				connectors.value[0].name === 'BrowserWallet'
			) {
				await onClickWallet(connectors.value[0].name)
			}
		}
	},
)

async function onClickWallet(connName: ConnectorName, rdns?: RDNS | string) {
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

function onClickCancelConnecting() {
	disconnect()
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
			<div id="vd-modal" v-click-outside="closeModal">
				<div
					v-for="detail in providerDetails"
					:key="detail.info.uuid"
					@click="onClickWallet('BrowserWallet', detail.info.rdns)"
					class="vd-wallet-block"
					:class="{
						'vd-wallet-block--dark': dark,
					}"
				>
					<img class="vd-logo" :src="detail.info.icon" :alt="detail.info.name" />
					<div>{{ detail.info.name }}</div>
					<!-- <div :class="dark ? 'vd-line--dark' : 'vd-line'"></div> -->
				</div>

				<div
					v-if="hasConnector('WalletConnect')"
					@click="onClickWallet('WalletConnect')"
					class="vd-wallet-block"
					:class="{
						'vd-wallet-block--dark': dark,
					}"
				>
					<WalletConnectIcon class="vd-logo" />
					<div>WalletConnect</div>
				</div>

				<div
					v-if="hasConnector('CoinbaseWallet')"
					@click="onClickWallet('CoinbaseWallet')"
					class="vd-wallet-block"
					:class="{
						'vd-wallet-block--dark': dark,
					}"
				>
					<img
						class="vd-logo"
						src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI4IDU2YzE1LjQ2NCAwIDI4LTEyLjUzNiAyOC0yOFM0My40NjQgMCAyOCAwIDAgMTIuNTM2IDAgMjhzMTIuNTM2IDI4IDI4IDI4WiIgZmlsbD0iIzFCNTNFNCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNyAyOGMwIDExLjU5OCA5LjQwMiAyMSAyMSAyMXMyMS05LjQwMiAyMS0yMVMzOS41OTggNyAyOCA3IDcgMTYuNDAyIDcgMjhabTE3LjIzNC02Ljc2NmEzIDMgMCAwIDAtMyAzdjcuNTMzYTMgMyAwIDAgMCAzIDNoNy41MzNhMyAzIDAgMCAwIDMtM3YtNy41MzNhMyAzIDAgMCAwLTMtM2gtNy41MzNaIiBmaWxsPSIjZmZmIi8+PC9zdmc+"
						alt="Coinbase Wallet"
					/>
					<div>Coinbase Wallet</div>
				</div>
			</div>
		</Modal>

		<slot name="connecting">
			<Modal :modalOpen="status === 'connecting' && !isAutoConnecting" :dark="dark">
				<div class="vd-loading-modal" v-if="status === 'connecting'">
					<p>Connecting...</p>
					<p class="mt-4">Approve or reject request using your wallet</p>

					<button
						class="vd-cancel-btn"
						:class="{
							'vd-cancel-btn--dark': dark,
						}"
						@click="onClickCancelConnecting"
					>
						Cancel
					</button>
				</div>
			</Modal>
		</slot>
	</div>
</template>

<style scoped>
#vd-modal {
	width: 450px;
	height: auto;

	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 5px;
	padding: 15px 15px;
}

.vd-wallet-block {
	padding: 10px 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;
	border-radius: 0.75rem;
	cursor: pointer;
}

/* wallet-block dark hover  */
.vd-wallet-block.vd-wallet-block--dark:hover {
	background-color: #101a20;
}

/* wallet-block light hover */
.vd-wallet-block:not(.vd-wallet-block--dark):hover {
	background-color: rgba(142, 142, 142, 0.1);
}

.vd-logo {
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
}

/* =============== Modal for connecting =============== */

.vd-loading-modal {
	width: 20rem;
	padding: 2.5rem;
	text-align: center;
}

.vd-loading-modal > p:first-child {
	font-size: 1.25rem;
}

/* =============== cancel button for connecting modal (start) =============== */
.vd-cancel-btn {
	margin-top: 15px;

	border-radius: 8px;
	border: 1px solid transparent;
	padding: 0.4em 0.8em;
	font-size: 1em;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	transition: border-color 0.25s;
}

.vd-cancel-btn:focus,
.vd-cancel-btn:focus-visible {
	outline: 0px auto -webkit-focus-ring-color;
}

/* cancel-btn light */
.vd-cancel-btn:not(.vd-cancel-btn--dark) {
	border: gray 1px solid;
	background-color: rgba(236, 237, 239, 0.737);
	color: #1a1a1a;
}

/* cancel-btn light hover */
.vd-cancel-btn:not(.vd-cancel-btn--dark):hover {
	background-color: rgba(142, 142, 142, 0.1);
}

/* cancel-btn dark  */
.vd-cancel-btn.vd-cancel-btn--dark {
	border: inherit 1px solid;
	background-color: #101a20;
	color: rgba(236, 237, 239, 0.737);
}

/* cancel-btn dark hover */
.vd-cancel-btn.vd-cancel-btn--dark:hover {
	border: white 1px solid;
	background-color: #101a20;
}

/* =============== cancel button for connecting modal (end) =============== */

@media (max-width: 460px) {
	#vd-modal {
		width: 95vw;
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}

	.vd-loading-modal {
		width: 95vw;
		padding: 1.5rem 5px;
	}

	.vd-loading-modal > p:first-child {
		font-size: 1rem;
	}
}

.vd-line {
	border-color: rgba(236, 237, 239, 0.737);
	border-width: 0px;
	border-bottom-width: 1px;
	border-style: solid;
}

.vd-line--dark {
	border-color: rgba(195, 195, 195, 0.14);
	border-width: 0px;
	border-bottom-width: 1px;
	border-style: solid;
}

/* =============== deprecated =============== */
.vd-wallet-disabled {
	opacity: 0.5;
}

.vd-wallet-disabled:hover {
	background-color: rgba(255, 255, 255, 0);
	cursor: default;
}
</style>
