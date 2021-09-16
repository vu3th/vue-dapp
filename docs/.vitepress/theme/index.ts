// @ts-nocheck
import DefaultTheme from 'vitepress/theme'
import Features from '../components/Features.vue'
import Layout from '../components/Layout.vue'
import './style.css'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Features', Features)
  },
}
