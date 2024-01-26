import vSelect from 'vs-vue3-select'
import type { VSelectProps, VSelectEvents, VSelectSlots } from 'vs-vue3-select'
import 'vs-vue3-select/dist/vs-vue3-select.css'
import '@/styles/vars.scss' // Note: 一定要在這裡或在 app.vue 引入，在 nuxt.config 或 main.scss 都不行

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.component('VSelect', vSelect as Component<VSelectProps, VSelectEvents, VSelectSlots>)
})
