<script lang="ts">
import { defineComponent, inject, onMounted, ref } from 'vue-demi'
import Modal from './Modal.vue'
import WalletConnectIcon from './logos/WalletConnect.vue'
import MetaMaskIcon from './logos/MetaMask.vue'
import { useBoard } from '../composables/useBoard'
import { useWallet, WalletName } from '../composables/useWallet'
import { Config } from '../types'
import Metamask from '../wallets/metamask'

export default defineComponent({
  components: {
    Modal,
    MetaMaskIcon,
    WalletConnectIcon,
  },
  inject: ['dappConfig'],
  setup() {
    const { boardOpen, close } = useBoard()
    const { connect, status } = useWallet()

    const metamaskDisabled = ref(true)
    const walletconnectDisabled = ref(true)
    const config = inject('dappConfig') as Config

    // check metamask and walletconnect available
    onMounted(async () => {
      if (await Metamask.check()) {
        metamaskDisabled.value = false
      }
      if (config.infuraId) {
        walletconnectDisabled.value = false
      }
    })

    const loadingOpen = ref(false)
    const openLoading = () => {
      loadingOpen.value = true
    }
    const closeLoading = () => {
      loadingOpen.value = false
    }

    const connectWallet = async (wallet: WalletName) => {
      close()
      openLoading()
      try {
        switch (wallet) {
          case 'metamask':
            await connectMetamask()
            break
          case 'walletconnect':
            await connectWalletconnect()
            break
        }
      } catch (e: any) {
        console.error(e.message)
      } finally {
        closeLoading()
      }
    }

    const connectMetamask = async () => {
      if (metamaskDisabled.value) return
      await connect('metamask')
    }

    const connectWalletconnect = async () => {
      if (walletconnectDisabled.value) return
      await connect('walletconnect', config.infuraId)
    }

    return {
      status,
      boardOpen,
      metamaskDisabled,
      walletconnectDisabled,
      close,
      connectWallet,

      // pending modal
      loadingOpen,
      openLoading,
      closeLoading,
    }
  },
})
</script>

<template>
  <Modal
    :modalOpen="boardOpen"
    @close="close"
  >
    <div
      @click="connectWallet('metamask')"
      class="wallet-item"
      :class="metamaskDisabled? 'wallet-disabled' : ''"
    >
      <div class="item">
        <MetaMaskIcon class="logo" />
        <div>MetaMask</div>
      </div>
    </div>
    <div class="line"></div>
    <div
      @click="connectWallet('walletconnect')"
      class="wallet-item"
      :class="walletconnectDisabled? 'wallet-disabled' : ''"
    >
      <div class="item">
        <WalletConnectIcon class="logo" />
        <div>WalletConnect</div>
      </div>
    </div>
  </Modal>

  <Modal :modalOpen="loadingOpen">
    <div
      class="loading-modal"
      v-if="status === 'connecting'"
    >
      <p>Pending Call Request</p>
      <p>Approve or reject request using your wallet</p>
    </div>

    <div
      class="loading-modal"
      v-if="status === 'connected'"
    >
      <p>Loading...</p>
    </div>
  </Modal>
</template>

<style scoped>
.wallet-item {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  margin: 0.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
}

.wallet-item:hover {
  background-color: rgba(243, 244, 246, 0.664);
}

@media (min-width: 640px) {
  .wallet-item {
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
  color: #e5e7eb;
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
  background-color: rgba(255, 255, 255, 0.623);
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