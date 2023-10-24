import VueSelect from 'vue3-select'

import 'vue3-select/dist/vue3-select.css'
import '@/styles/vars.scss' // Note: 一定要在這裡或在 app.vue 引入，在 nuxt.config 或 main.scss 都不行

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.component('VueSelect', VueSelect)
})
