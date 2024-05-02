# Development

## If you update the Wallet state, you also need to update the follows:

- core/src/types/wallet.ts -> type Wallet
- core/src/store.ts -> wallet
- core/src/services/connect.ts -> resetWallet
- core/src/services/connect.ts -> return Computed
- core/src/types/listeners.ts -> type ConnWallet
- core/src/utils/assert.ts -> assertConnected

docs updates
- app/content/en/overview.md -> Wallet & isConnected
- app/content/zh-TW/overview.md -> Wallet & isConnected


## Git Commit Convention

If changes affect functionality within the packages, they will be merged using the Github Pull Request. Otherwise, updates for the website (app) or documentations will be pushed directly to the main branch.
