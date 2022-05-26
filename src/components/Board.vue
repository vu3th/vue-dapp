<script lang="ts">
import { computed, defineComponent } from 'vue'
import Modal from './Modal.vue'
import Loader from './Loader.vue'
import WalletConnectIcon from './logos/WalletConnect.vue'
import MetaMaskIcon from './logos/MetaMask.vue'
import CoinbaseWallet from './logos/CoinbaseWallet.vue'
import { useBoard } from '../composables/useBoard'
import { useWallet } from '../composables/useWallet'
import { Connector } from '../wallets'

export default defineComponent({
  components: {
    Modal,
    Loader,
    MetaMaskIcon,
    WalletConnectIcon,
    CoinbaseWallet,
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
  },
  setup(props) {
    const { boardOpen, close } = useBoard()
    const { connectWith, wallet } = useWallet()

    const walletItemClass = computed(() =>
      props.dark ? 'wallet-item--dark' : 'wallet-item',
    )

    const connectors = props.connectors as Connector[]

    return {
      boardOpen,
      wallet,
      connectors,
      walletItemClass,
      connectWith,
      close,
    }
  },
})
</script>

<template>
  <Modal :modalOpen="boardOpen" @close="close" :dark="dark">
    <div v-click-outside="close">
      <div v-for="(connector, i) in connectors" :key="connector.name">
        <div
          :class="walletItemClass"
          @click="connectWith(connector) && close()"
        >
          <div class="item">
            <MetaMaskIcon v-if="connector.name === 'metaMask'" class="logo" />
            <WalletConnectIcon
              v-if="connector.name === 'walletConnect'"
              class="logo"
            />
            <CoinbaseWallet
              v-if="connector.name === 'coinbaseWallet'"
              class="logo"
            />

            <div v-if="connector.name === 'metaMask'">MeteMask</div>
            <div v-if="connector.name === 'walletConnect'">WalletConnect</div>
            <div v-if="connector.name === 'coinbaseWallet'">
              Coinbase Wallet
            </div>
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
    <Modal :modalOpen="wallet.status === 'connecting'" :dark="dark">
      <div class="loading-modal" v-if="wallet.status === 'connecting'">
        <p>Connecting...</p>
        <p class="mt-4">Approve or reject request using your wallet</p>
      </div>
    </Modal>
  </slot>

  <slot name="loading">
    <Modal :modalOpen="wallet.status === 'loading'" :dark="dark"></Modal>
  </slot>
</template>

<style scoped>
.wallet-item {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  padding-bottom: 0.6rem;
  padding-left: 1rem;
  padding-right: 1rem;
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
  padding-top: 1rem;
  padding-bottom: 0.6rem;
  padding-left: 1rem;
  padding-right: 1rem;
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
