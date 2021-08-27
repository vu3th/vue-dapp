<script lang="ts">
import { defineComponent } from 'vue-demi'
import { useWallet } from '../useWallet'
import { useBoard } from '../useBoard'
import { Wallet } from '../constants/wallet'
import Modal from './Modal.vue'
import WalletConnect from './logos/WalletConnect.vue'
import MetaMask from './logos/MetaMask.vue'

export default defineComponent({
  components: {
    Modal,
    WalletConnect,
    MetaMask,
  },
  setup() {
    const { boardOpen, close } = useBoard()
    const { connect } = useWallet()

    const connectMetamask = async () => {
      await connect(Wallet.metamask)
      close()
    }

    return {
      boardOpen,
      close,
      connectMetamask,
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
    >
      <div class="item">
        <MetaMask class="logo" />
        <div>MetaMask</div>
      </div>
    </div>
    <div class="line"></div>
    <div class="wallet-item wip">
      <div class="item">
        <WalletConnect class="logo" />
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

.wip {
  opacity: 0.5;
}

.wip:hover {
  background-color: rgba(255, 255, 255, 0.623);
  cursor: default;
}
</style>