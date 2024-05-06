<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Modal from './components/Modal.vue'
import WalletConnectIcon from './components/logos/WalletConnectIcon.vue'
import { useVueDapp, ConnectorName, ConnectOptions } from '@vue-dapp/core'
import { useVueDappModal } from './store'

const props = withDefaults(
	defineProps<{
		modelValue?: boolean | undefined
		dark?: boolean
		autoConnect?: boolean
		autoConnectBrowserWalletIfSolo?: boolean
		hideConnectingModal?: boolean
	}>(),
	{
		modelValue: undefined,
		dark: false,
		autoConnect: false,
		autoConnectBrowserWalletIfSolo: false,
		hideConnectingModal: false,
	},
)

const emit = defineEmits(['update:modelValue', 'connectError', 'autoConnectError'])

const store = useVueDappModal()

function closeModal() {
	if (props.modelValue === undefined) {
		store.close()
	} else {
		emit('update:modelValue', false)
	}
}

const modalOpen = computed(() => props.modelValue ?? store.isModalOpen)

const isAutoConnecting = ref(false)

const {
	isWindowEthereumAvailable,
	connectors,
	connectTo,
	autoConnect,
	status,
	providerDetails,
	hasConnector,
	disconnect,
} = useVueDapp()

// ============================ feat: autoConnect ============================
onMounted(async () => {
	if (props.autoConnect) {
		try {
			isAutoConnecting.value = true
			if (isMobileAppBrowser()) {
				await autoConnect('window.ethereum')
			} else {
				await autoConnect('rdns')
			}
		} catch (err: any) {
			emit('autoConnectError', err)
		} finally {
			isAutoConnecting.value = false
		}
	}
})

watch(modalOpen, async () => {
	// ============================ feat: connect to window.ethereum if window.ethereum is available ============================
	if (modalOpen.value && providerDetails.value.length === 0 && isMobileAppBrowser()) {
		if (isWindowEthereumAvailable) {
			await onClickWallet('BrowserWallet', {
				target: 'window.ethereum',
			})
		}
		return
	}

	// ============================ feat: auto click BrowserWallet if it's the only connector ============================
	if (props.autoConnectBrowserWalletIfSolo && modalOpen.value) {
		if (
			connectors.value.length === 1 && // only one connector
			providerDetails.value.length === 1 && // only one browser provider
			connectors.value[0].name === 'BrowserWallet'
		) {
			await onClickWallet('BrowserWallet', {
				target: 'rdns',
				rdns: providerDetails.value[0].info.rdns,
			})
		}
	}
})

async function onClickWallet<T extends ConnectorName>(connName: T, options?: ConnectOptions<T>) {
	try {
		closeModal()
		await connectTo<ConnectorName>(connName, options)
	} catch (err: any) {
		emit('connectError', err)
	}
}

function onClickCancelConnecting() {
	disconnect()
}

// Check whether the browser is within a mobile app (such as a WebView) rather than a standalone mobile browser like Chrome App
function isMobileAppBrowser() {
	const userAgent = navigator.userAgent

	// for ios
	if (!userAgent.includes('Safari/') && userAgent.includes('Mobile/')) {
		return true
	}

	// for android
	if (userAgent.includes('wv') || userAgent.includes('WebView')) {
		return true
	}

	return false
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

const columnAmount = computed(() => {
	let total = providerDetails.value.length
	if (hasConnector('WalletConnect')) total++
	if (hasConnector('CoinbaseWallet')) total++
	if (total < 2) return 1
	return 2
})

const isOneColumn = computed(() => columnAmount.value === 1)
const isNoWalletFound = computed(
	() => providerDetails.value.length === 0 && !hasConnector('WalletConnect') && !hasConnector('CoinbaseWallet'),
)

const vdModalPadding = computed(() => {
	if (isOneColumn.value) return '10px 10px'
	return '15px 15px'
})
</script>

<template>
	<div>
		<Modal :modalOpen="modalOpen" @close="closeModal" :dark="dark">
			<div
				id="vd-modal"
				:style="{
					'grid-template-columns': `repeat(${columnAmount}, minmax(0, 1fr))`,
					width: isOneColumn ? '300px' : '450px',
					height: isOneColumn ? '80px' : 'auto',
					padding: vdModalPadding,
				}"
				v-click-outside="closeModal"
			>
				<div
					v-for="detail in providerDetails"
					:key="detail.info.uuid"
					@click="
						onClickWallet('BrowserWallet', {
							target: 'rdns',
							rdns: detail.info.rdns,
						})
					"
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

				<slot v-if="isNoWalletFound && $slots['no-wallet-found']" name="no-wallet-found"></slot>
				<div id="vd-no-wallet-found" v-else-if="isNoWalletFound">No wallet provider found 😔</div>
			</div>
		</Modal>

		<Modal v-if="!hideConnectingModal" :modalOpen="status === 'connecting' && !isAutoConnecting" :dark="dark">
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
	</div>
</template>

<style scoped>
#vd-modal {
	display: grid;
	gap: 5px;
}

#vd-modal .vd-wallet-block {
	padding: 10px 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;
	border-radius: 0.75rem;
	cursor: pointer;
}

/* wallet-block dark hover  */
#vd-modal .vd-wallet-block.vd-wallet-block--dark:hover {
	background-color: #101a20;
}

/* wallet-block light hover */
#vd-modal .vd-wallet-block:not(.vd-wallet-block--dark):hover {
	background-color: rgba(142, 142, 142, 0.1);
}

#vd-modal .vd-logo {
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
}

/* =============== Modal for connecting =============== */

#vd-modal .vd-loading-modal {
	width: 20rem;
	padding: 2.5rem;
	text-align: center;
}

#vd-modal .vd-loading-modal > p:first-child {
	font-size: 1.25rem;
}

/* =============== cancel button for connecting modal (start) =============== */
#vd-modal .vd-cancel-btn {
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

#vd-modal .vd-cancel-btn:focus,
#vd-modal .vd-cancel-btn:focus-visible {
	outline: 0px auto -webkit-focus-ring-color;
}

/* cancel-btn light */
#vd-modal .vd-cancel-btn:not(.vd-cancel-btn--dark) {
	border: gray 1px solid;
	background-color: rgba(236, 237, 239, 0.737);
	color: #1a1a1a;
}

/* cancel-btn light hover */
#vd-modal .vd-cancel-btn:not(.vd-cancel-btn--dark):hover {
	background-color: rgba(142, 142, 142, 0.1);
}

/* cancel-btn dark  */
#vd-modal .vd-cancel-btn.vd-cancel-btn--dark {
	border: inherit 1px solid;
	background-color: #101a20;
	color: rgba(236, 237, 239, 0.737);
}

/* cancel-btn dark hover */
#vd-modal .vd-cancel-btn.vd-cancel-btn--dark:hover {
	border: white 1px solid;
	background-color: #101a20;
}

/* =============== cancel button for connecting modal (end) =============== */

@media (max-width: 460px) {
	#vd-modal {
		width: 95vw;
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}

	#vd-modal .vd-loading-modal {
		width: 95vw;
		padding: 1.5rem 5px;
	}

	#vd-modal .vd-loading-modal > p:first-child {
		font-size: 1rem;
	}
}

#vd-modal .vd-line {
	border-color: rgba(236, 237, 239, 0.737);
	border-width: 0px;
	border-bottom-width: 1px;
	border-style: solid;
}

#vd-modal .vd-line--dark {
	border-color: rgba(195, 195, 195, 0.14);
	border-width: 0px;
	border-bottom-width: 1px;
	border-style: solid;
}

#vd-modal #vd-no-wallet-found {
	color: rgb(86, 91, 104);
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
