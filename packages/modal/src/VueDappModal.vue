<script setup lang="ts">
import { ConnectOptions, ConnectorName, isMobileBrowser, useAutoConnect, useVueDapp } from '@vue-dapp/core'
import { Ref, computed, watch } from 'vue'
import Modal from './components/Modal.vue'
import WalletConnectIcon from './components/logos/WalletConnectIcon.vue'
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

const { providerDetails, isWindowEthereumAvailable, connectors, connectTo, status, hasConnector, disconnect } =
	useVueDapp()

// for test "No wallet provider found."
// const providerDetails = computed(() => [])
// ============================ feat: autoConnect ============================

let isAutoConnecting: Ref<boolean>

if (props.autoConnect) {
	const { isAutoConnecting: _isAutoConnecting, error: autoConnectError } = useAutoConnect()
	isAutoConnecting = _isAutoConnecting

	watch(autoConnectError, err => {
		if (err) {
			emit('autoConnectError', err)
		}
	})
}

watch(modalOpen, async () => {
	// ============================ feat: connect to window.ethereum in the mobile browser ============================
	if (modalOpen.value && isMobileBrowser()) {
		if (isWindowEthereumAvailable) {
			await onClickWallet('BrowserWallet', {
				target: 'window.ethereum',
			})
		}
		return
	}

	// ============================ feat: auto click BrowserWallet if it's the only connector ============================
	if (modalOpen.value && props.autoConnectBrowserWalletIfSolo) {
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

// const columnAmount = computed(() => {
// 	let total = providerDetails.value.length
// 	if (hasConnector('WalletConnect')) total++
// 	if (hasConnector('CoinbaseWallet')) total++
// 	if (total < 2) return 1
// 	return 2
// })

// const isOneColumn = computed(() => columnAmount.value === 1)
const isNoWalletFound = computed(
	() => providerDetails.value.length === 0 && !hasConnector('WalletConnect') && !hasConnector('CoinbaseWallet'),
)
</script>

<template>
	<div>
		<Modal :modalOpen="modalOpen" @close="closeModal" :dark="dark">
			<div id="vd-modal" class="vd-modal-column" v-click-outside="closeModal">
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
						src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iMTQiIGZpbGw9IiMwMDUyRkYiLz48cGF0aCBkPSJNMTQuMDM3IDE4LjkyNmMtMi43NSAwLTQuOTA3LTIuMjA1LTQuOTA3LTQuOTI2IDAtMi43MiAyLjIzLTQuOTI2IDQuOTA3LTQuOTI2YTQuODY2IDQuODY2IDAgMCAxIDQuODMzIDQuMTE4aDQuOTgyYy0uNDQ2LTUuMDczLTQuNjg0LTkuMDQ0LTkuODE1LTkuMDQ0QzguNjEgNC4xNDggNC4xNDkgOC41NiA0LjE0OSAxNHM0LjM4NyA5Ljg1MiA5Ljg5IDkuODUyYzUuMjA0IDAgOS4zNjgtMy45NyA5LjgxNC05LjA0M0gxOC44N2E0Ljg2NiA0Ljg2NiAwIDAgMS00LjgzMyA0LjExN1oiIGZpbGw9IiNmZmYiLz48L3N2Zz4="
						alt="Coinbase"
					/>
					<div>Coinbase</div>
				</div>

				<slot v-if="isNoWalletFound && $slots['no-wallet-found']" name="no-wallet-found"></slot>
				<div id="vd-no-wallet-found" v-else-if="isNoWalletFound">No wallet provider found.</div>
			</div>
		</Modal>

		<Modal v-if="!hideConnectingModal" :modalOpen="status === 'connecting' && !isAutoConnecting" :dark="dark">
			<div id="vd-loading-modal" v-if="status === 'connecting'" v-click-outside="() => disconnect()">
				<p>Connecting...</p>
			</div>
		</Modal>
	</div>
</template>

<style scoped>
#vd-modal {
	display: flex;
	flex-direction: column;
	gap: 0px;
	height: auto;
	min-height: 150px;
	padding: 20px 15px;
}

#vd-modal.vd-modal-column {
	width: 320px;
}

@media (max-width: 420px) {
	#vd-modal.vd-modal-column {
		width: 85vw;
	}
}

#vd-modal .vd-wallet-block {
	height: 100%;
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

#vd-loading-modal {
	width: 240px;
	padding: 2.5rem;
	text-align: center;
}

#vd-loading-modal > p:first-child {
	font-size: 1.1rem;
}

@media (max-width: 420px) {
	#vd-loading-modal {
		width: 85vw;
		padding: 1.5rem 0.8em;
	}

	#vd-loading-modal > p:first-child {
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
	height: 100%;
	color: rgb(133, 133, 133);
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
