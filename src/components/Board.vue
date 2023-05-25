<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref } from 'vue'
import Modal from './Modal.vue'
import Loader from './Loader.vue'
import WalletConnectIcon from './logos/WalletConnect.vue'
import MetaMaskIcon from './logos/MetaMask.vue'
import CoinbaseWalletIcon from './logos/CoinbaseWallet.vue'
import GnosisSafeIcon from './logos/GnosisSafe.vue'

import { useBoard } from '../composables/useBoard'
import { useWallet } from '../composables/useWallet'
import { Connector } from '../connectors'

export default defineComponent({
  components: {
    Modal,
    Loader,
    MetaMaskIcon,
    WalletConnectIcon,
    CoinbaseWalletIcon,
    GnosisSafeIcon,
  },
  props: {
    connectors: {
      type: Array,
      required: true,
      default: [],
    },
    dark: {
      type: Boolean,
      required: false,
      default: false,
    },
    connectErrorHandler: {
      type: Function,
      required: false,
      default: undefined,
    },
    autoConnectErrorHandler: {
      type: Function,
      required: false,
      default: undefined,
    },
  },
  setup(props) {
    const { boardOpen, close } = useBoard()
    const { connectWith, wallet, autoConnect } = useWallet()

    const walletItemClass = computed(() =>
      props.dark ? 'wallet-item--dark' : 'wallet-item',
    )

    const connectors = props.connectors as Connector[]

    const isAutoConnecting = ref(false)
    const isAutoConnect = inject('autoConnect')
    const connectTimeout = inject('connectTimeout') as number | undefined

    onMounted(async () => {
      if (isAutoConnect) {
        try {
          isAutoConnecting.value = true
          await autoConnect(connectors)
        } catch (err: any) {
          props.autoConnectErrorHandler && props.autoConnectErrorHandler(err)
        } finally {
          isAutoConnecting.value = false
        }
      }
    })

    const onClickWallet = async (connector: Connector) => {
      try {
        close()
        await connectWith(connector, connectTimeout)
      } catch (err: any) {
        props.connectErrorHandler && props.connectErrorHandler(err)
      }
    }

    return {
      isAutoConnecting,
      boardOpen,
      wallet,
      connectors,
      walletItemClass,
      onClickWallet,
      close,
    }
  },
})
</script>

<template>
  <Modal :modalOpen="boardOpen" @close="close" :dark="dark">
    <div v-click-outside="close">
      <div v-for="(connector, i) in connectors" :key="connector.name">
        <div :class="walletItemClass" @click="onClickWallet(connector)">
          <div class="item">
            <!-- TODO: refactor these v-if -->
            <MetaMaskIcon v-if="connector.name === 'metaMask'" class="logo" />
            <WalletConnectIcon
              v-if="connector.name === 'walletConnect'"
              class="logo"
            />
            <CoinbaseWalletIcon
              v-if="connector.name === 'coinbaseWallet'"
              class="logo"
            />
            <GnosisSafeIcon v-if="connector.name === 'safe'" class="logo" />

            <div v-if="connector.name === 'metaMask'">MetaMask</div>
            <div v-if="connector.name === 'walletConnect'">WalletConnect</div>
            <div v-if="connector.name === 'coinbaseWallet'">
              Coinbase Wallet
            </div>
            <div v-if="connector.name === 'safe'">Gnosis Safe</div>
          </div>
        </div>
        <div
          v-if="i !== connectors.length - 1"
          :class="dark ? 'line--dark' : 'line'"
        ></div>
      </div>
    </div>
  </Modal>

  <slot name="connecting">
    <Modal
      :modalOpen="wallet.status === 'connecting' && !isAutoConnecting"
      :dark="dark"
    >
      <div class="loading-modal" v-if="wallet.status === 'connecting'">
        <p>Connecting...</p>
        <p class="mt-4">Approve or reject request using your wallet</p>
      </div>
    </Modal>
  </slot>

  <slot name="loading">
    <Modal
      :modalOpen="wallet.status === 'loading' && !isAutoConnecting"
      :dark="dark"
    ></Modal>
  </slot>
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
  flex-direction: column;
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
