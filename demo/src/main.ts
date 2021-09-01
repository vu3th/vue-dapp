import { createApp } from 'vue'
import App from './App.vue'
import 'windi.css'
import './style.css'
import { VueDapp, Config } from 'vue-dapp'

const app = createApp(App)

const dappConfig: Partial<Config> = {
  infuraId: 'ff6a249a74e048f1b413cba715f98d07',
}

app.use(VueDapp, dappConfig)

app.mount('#app')
