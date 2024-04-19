// vite.config.mjs
import { defineConfig } from "file:///Users/johnson/vue-dapp/node_modules/.pnpm/vite@5.2.9_sass@1.70.0/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/johnson/vue-dapp/node_modules/.pnpm/@vitejs+plugin-vue@5.0.3_vite@5.2.9_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import dts from "file:///Users/johnson/vue-dapp/node_modules/.pnpm/vite-plugin-dts@3.7.2_typescript@5.3.3_vite@5.2.9/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/johnson/vue-dapp/packages/modal";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    assetsDir: "assets",
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "@vue-dapp/modal",
      fileName: "modal"
    },
    outDir: "dist",
    rollupOptions: {
      external: ["vue", "pinia", "@vue-dapp/core"],
      output: {
        dir: "dist",
        globals: {
          vue: "vue",
          pinia: "pinia",
          "@vue-dapp/core": "core"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2pvaG5zb24vdnVlLWRhcHAvcGFja2FnZXMvbW9kYWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9qb2huc29uL3Z1ZS1kYXBwL3BhY2thZ2VzL21vZGFsL3ZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvam9obnNvbi92dWUtZGFwcC9wYWNrYWdlcy9tb2RhbC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtcblx0XHR2dWUoKSxcblx0XHRkdHMoe1xuXHRcdFx0aW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcblx0XHR9KSxcblx0XSxcblx0YnVpbGQ6IHtcblx0XHRhc3NldHNEaXI6ICdhc3NldHMnLFxuXHRcdGxpYjoge1xuXHRcdFx0ZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcblx0XHRcdG5hbWU6ICdAdnVlLWRhcHAvbW9kYWwnLFxuXHRcdFx0ZmlsZU5hbWU6ICdtb2RhbCcsXG5cdFx0fSxcblx0XHRvdXREaXI6ICdkaXN0Jyxcblx0XHRyb2xsdXBPcHRpb25zOiB7XG5cdFx0XHRleHRlcm5hbDogWyd2dWUnLCAncGluaWEnLCAnQHZ1ZS1kYXBwL2NvcmUnXSxcblx0XHRcdG91dHB1dDoge1xuXHRcdFx0XHRkaXI6ICdkaXN0Jyxcblx0XHRcdFx0Z2xvYmFsczoge1xuXHRcdFx0XHRcdHZ1ZTogJ3Z1ZScsXG5cdFx0XHRcdFx0cGluaWE6ICdwaW5pYScsXG5cdFx0XHRcdFx0J0B2dWUtZGFwcC9jb3JlJzogJ2NvcmUnLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1MsU0FBUyxvQkFBb0I7QUFDblUsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFNBQVM7QUFIaEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUztBQUFBLElBQ1IsSUFBSTtBQUFBLElBQ0osSUFBSTtBQUFBLE1BQ0gsa0JBQWtCO0FBQUEsSUFDbkIsQ0FBQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNOLFdBQVc7QUFBQSxJQUNYLEtBQUs7QUFBQSxNQUNKLE9BQU8sS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUM3QyxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsSUFDWDtBQUFBLElBQ0EsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2QsVUFBVSxDQUFDLE9BQU8sU0FBUyxnQkFBZ0I7QUFBQSxNQUMzQyxRQUFRO0FBQUEsUUFDUCxLQUFLO0FBQUEsUUFDTCxTQUFTO0FBQUEsVUFDUixLQUFLO0FBQUEsVUFDTCxPQUFPO0FBQUEsVUFDUCxrQkFBa0I7QUFBQSxRQUNuQjtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
