import { createApp } from 'vue'
import App from './App.vue'
import 'windi.css'
import './style.css'
import { VueDapp } from 'vue-dapp'

const app = createApp(App)

app.use(VueDapp, {
  infuraId: 'ff6a249a74e048f1b413cba715f98d07',
})

app.mount('#app')
