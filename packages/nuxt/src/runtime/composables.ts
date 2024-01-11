import { useVueDapp as _useVueDapp } from '@vue-dapp/core'
import { useNuxtApp } from '#app'

export const useVueDapp = () => _useVueDapp(useNuxtApp().$pinia)
