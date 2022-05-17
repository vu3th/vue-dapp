<script lang="ts">
import { defineComponent, inject, onMounted, ref } from 'vue'
import Modal from './Modal.vue'
import WalletConnectIcon from './logos/WalletConnect.vue'
import MetaMaskIcon from './logos/MetaMask.vue'
import WalletLinkIcon from './logos/WalletLink.vue'
import { useBoard } from '../composables/useBoard'
import { useWallet, WalletName } from '../composables/useWallet'
import { Metamask } from '../wallets/metamask'
import { Walletconnect } from '../wallets/walletconnect'
import { Walletlink } from '../wallets/walletlink'

export default defineComponent({
  components: {
    Modal,
    MetaMaskIcon,
    WalletConnectIcon,
    WalletLinkIcon,
  },
  inject: ['infuraId', 'appName', 'appUrl', 'darkMode'],
  setup() {
    const { boardOpen, close } = useBoard()
    const { connect, status } = useWallet()

    const metamaskDisabled = ref(true)
    const walletconnectDisabled = ref(true)
    const walletlinkDisabled = ref(true)
    const infuraId = inject('infuraId') as string
    const appName = inject('appName') as string
    const appUrl = inject('appUrl') as string
    const darkMode = inject('darkMode') as boolean
    const walletItemClass = ref(darkMode ? 'wallet-item--dark' : 'wallet-item')

    // check metamask and walletconnect available
    onMounted(async () => {
      if (await Metamask.check()) {
        metamaskDisabled.value = false
      }
      if (infuraId && (await Walletconnect.check())) {
        walletconnectDisabled.value = false
      }
      if (infuraId && appName && (await Walletlink.check())) {
        walletlinkDisabled.value = false
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
      try {
        switch (wallet) {
          case 'metamask':
            await connectMetamask()
            break
          case 'walletconnect':
            await connectWalletconnect()
            break
          case 'walletlink':
            await connectWalletlink()
            break
        }
      } catch (e: any) {
        console.error(e.message)
      } finally {
        closeLoading()
      }
    }

    const connectMetamask = async () => {
      if (metamaskDisabled.value && appUrl) {
        window.open(`https://metamask.app.link/dapp/${appUrl}`, '_blank')
        return
      } else if (metamaskDisabled.value) return
      // Prevent from closing the board while clicking disabled wallet
      close()
      openLoading()
      await connect('metamask')
    }

    const connectWalletconnect = async () => {
      if (walletconnectDisabled.value) return
      // Prevent from closing the board while clicking disabled wallet
      close()
      openLoading()
      await connect('walletconnect', infuraId)
    }

    const connectWalletlink = async () => {
      if (walletlinkDisabled.value) return
      // Prevent from closing the board while clicking disabled wallet
      close()
      openLoading()
      await connect('walletlink', infuraId, appName)
    }

    return {
      status,
      boardOpen,
      metamaskDisabled,
      walletconnectDisabled,
      walletlinkDisabled,
      appUrl,
      darkMode,
      walletItemClass,
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
  <Modal :modalOpen="boardOpen" @close="close" :darkMode="darkMode">
    <div v-click-outside="close">
      <div
        @click="connectWallet('metamask')"
        :class="
          walletItemClass +
          ' ' +
          (metamaskDisabled && !appUrl ? 'wallet-disabled' : '')
        "
      >
        <div class="item">
          <MetaMaskIcon class="logo" />
          <div>MetaMask</div>
        </div>
      </div>
      <div :class="darkMode ? 'line--dark' : 'line'"></div>
      <div
        @click="connectWallet('walletconnect')"
        :class="
          walletItemClass +
          ' ' +
          (walletconnectDisabled ? 'wallet-disabled' : '')
        "
      >
        <div class="item">
          <WalletConnectIcon class="logo" />
          <div>WalletConnect</div>
        </div>
      </div>

      <div :class="darkMode ? 'line--dark' : 'line'"></div>
      <div
        @click="connectWallet('walletlink')"
        :class="
          walletItemClass + ' ' + (walletlinkDisabled ? 'wallet-disabled' : '')
        "
      >
        <div class="item">
          <WalletLinkIcon class="logo" />
          <div>Coinbase Wallet</div>
        </div>
      </div>
    </div>
  </Modal>

  <Modal :modalOpen="loadingOpen" :darkMode="darkMode">
    <div class="loading-modal" v-if="status === 'connecting'">
      <p>Pending Call Request</p>
      <p>Approve or reject request using your wallet</p>
    </div>

    <!-- loading between connected to isActivated -->
    <div v-if="status === 'connected'"></div>
  </Modal>
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
