# Contributing

Thanks for being interested in contributing to this project!

Just submit your changes via pull request and I will review them before merging.

If you are making a fix on the project, you can use the `main` branch and send a pull request.

If you are adding a new features, please create a new branch with a name describing your feature (`my-new-feature`), push to your branch and then submit a pull request.

## Development

### Setup
Clone this repo to your local machine and install the dependencies.
```
yarn install
```

For running the docs:
```
yarn dev:docs
```

For running the demo:
```
yarn dev
```

### Local Linking

If you want to develop your target project by linking local vue-dapp package, check out the steps below:

1. In your local vue-dapp project root, run `yarn link`.
2. In your target project root, run `yarn link vue-dapp`.
3. If you're using `vite`, add `optimizeDeps: { exclude: ['vue-demi'] }` at vite.config.ts.
4. Now the target project is using your local vue-dapp dist folder, so in vue-dapp project, run `yarn dev:dist` for watching the code change in real-time to build the new dist folder.

