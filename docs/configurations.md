# Configurations

## Vue CLI

- Example: [vuecli + vue-dapp starter](https://github.com/chnejohnson/vue3-dapp-starter/tree/vuecli)

If you're using [Vue CLI](https://cli.vuejs.org/guide/creating-a-project.html), you have to install [node-polyfill-webpack-plugin](https://www.npmjs.com/package/node-polyfill-webpack-plugin) and add the plugin in `vite.config.ts` as follows.

```js
const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
});
```

## Vite

- Example: [vue3-dapp-starter](https://github.com/chnejohnson/vue3-dapp-starter)

If you're using [Vite](https://vitejs.dev/), you should have the following settings in `vite.config.ts`:


```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import rollupPolyfillNode from 'rollup-plugin-polyfill-node'
import nodeStdlibBrowser from 'node-stdlib-browser'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		// Enable polyfill node used in development to prevent from vite's browser compatibility warning
		alias: { ...nodeStdlibBrowser },
	},
	optimizeDeps: {
		// Enable polyfill node used in development, refer to https://github.com/sodatea/vite-plugin-node-stdlib-browser/blob/b17f417597c313ecd52c3e420ba8fc33bcbdae20/index.cjs#L17
		esbuildOptions: {
			inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
		},
	},
	build: {
		rollupOptions: {
			plugins: [
				// Enable rollup polyfills plugin used in production bundling, refer to https://stackoverflow.com/a/72440811/10752354
				rollupPolyfillNode(),
			],
		},
		commonjsOptions: {
			transformMixedEsModules: true, // Enable @walletconnect/web3-provider which has some code in CommonJS
		},
	},
})
```

:::info
Refer to [issue#20](https://github.com/chnejohnson/vue-dapp/issues/20)
:::

## Nuxt3

- Example: [nuxt3 + vue-dapp starter](https://github.com/chnejohnson/vue3-dapp-starter/tree/nuxt3)

If you're using [Nuxt3](https://v3.nuxtjs.org/), you should have following dependencies and `nuxt.config.js`.

```json
"dependencies": {
  "@nuxt/webpack-builder": "^3.0.0-rc.1",
  "assert": "^2.0.0",
  "https-browserify": "^1.0.0",
  "os-browserify": "^0.3.0",
  "stream-browserify": "^3.0.0",
  "stream-http": "^3.2.0",
  "url": "^0.11.0",
  "vue-dapp": "^0.5.2"
},
"devDependencies": {
  "buffer": "^6.0.3",
  "nuxt": "3.0.0-rc.1",
  "process": "^0.11.10",
  "vue-demi": "^0.12.5"
}
```

nuxt.config.js

```js
import { defineNuxtConfig } from 'nuxt'
const webpack = require('webpack')

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  builder: 'webpack',
  hooks: {
    'webpack:config'(configs) {
      configs[0].resolve.fallback = {
        assert: require.resolve('assert/'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url/'),
      }
      configs[0].plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      )
      configs[0].plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      )
    },
  },
})

```

:::tip
Refer to [issue#33](https://github.com/chnejohnson/vue-dapp/issues/33)
:::
