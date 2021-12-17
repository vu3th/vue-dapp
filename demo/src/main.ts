import { createApp } from 'vue'
import App from './App.vue'
import 'windi.css'
import './style.css'
import { VueDapp } from 'vue-dapp'

const isDev = import.meta.env.DEV
const infuraId = import.meta.env.VITE_INFURA_ID // get VITE_INFURA_ID=<infura_id> from .env file in the project root.

const app = createApp(App)

app.use(VueDapp, {
  infuraId: isDev ? infuraId : 'ff6a249a74e048f1b413cba715f98d07',
  appName: 'Vue Dapp',
  appUrl: 'vue-dapp.netlify.app',
})

app.mount('#app')
