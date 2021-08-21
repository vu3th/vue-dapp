// @ts-nocheck
import { MotionPlugin } from '@vueuse/motion'
import DefaultTheme from 'vitepress/theme'
import Features from '../components/Features.vue'
import Hero from '../components/Hero.vue'
import Layout from '../components/Layout.vue'
import Person from '../components/Person.vue'
import PresetsViewer from '../components/PresetsViewer.vue'
import './style.css'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Features', Features)
  },
}
