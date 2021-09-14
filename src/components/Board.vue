<script lang="ts">
import { defineComponent, watchEffect, inject, onMounted, ref } from 'vue-demi'
import Modal from './Modal.vue'
import WalletConnectIcon from './logos/WalletConnect.vue'
import MetaMaskIcon from './logos/MetaMask.vue'
import { useBoard } from '../composables/useBoard'
import { useWallet } from '../composables/useWallet'
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

    watchEffect(() => {
      if (status.value === 'connecting') {
        close()
      }
    })

    const connectMetamask = async () => {
      if (metamaskDisabled.value) return
      connect('metamask')
    }

    const connectWalletconnect = async () => {
      if (walletconnectDisabled.value) return
      connect('walletconnect', config.infuraId)
    }

    return {
      boardOpen,
      metamaskDisabled,
      walletconnectDisabled,
      close,
      connectMetamask,
      connectWalletconnect,
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
      @click="connectMetamask"
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
      @click="connectWalletconnect"
      class="wallet-item"
      :class="walletconnectDisabled? 'wallet-disabled' : ''"
    >
      <div class="item">
        <WalletConnectIcon class="logo" />
        <div>WalletConnect</div>
      </div>
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
</style>