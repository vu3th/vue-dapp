import { createApp } from 'vue'
import TestModalApp from './TestModalApp.vue'
import { createPinia } from 'pinia'

const app = createApp(TestModalApp)
app.use(createPinia())

app.mount('#app')
