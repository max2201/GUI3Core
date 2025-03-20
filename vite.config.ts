import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import path from 'path'

import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: [
        {
          vue: [
            'ref',
            'computed',
            'watch',
            'watchEffect',
            'onBeforeMount',
            'onMounted',
            'onActivated',
            'onBeforeUpdate',
            'onBeforeUnmount',
            'onServerPrefetch',
            'useSlots',
            'nextTick',
          ],
        },
        {
          from: 'vue',
          imports: ['Ref'],
          type: true,
        },
        {
          'vue-router': ['useRoute', 'useRouter'],
        },
        {
          'vee-validate': ['useField', 'useForm'],
        },
        {
          pinia: ['defineStore', 'acceptHMRUpdate', 'storeToRefs'],
        },
      ],
      dirs: [
        './src/composables',
        './src/core',
        './src/core/config/**',
        './src/core/store/**',
        './src/core/utils/**',
      ],
      // vueTemplate: true,
      dts: true,
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      dts: true,
    }),
    vue(),
    ElementPlus({}),
    // eslintPlugin({
    //   failOnError: false,
    //   cache: false,
    // }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@c': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@m': fileURLToPath(new URL('./src/modules', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/styles/utils/index.scss";',
      },
    },
  },
  server: {
    proxy: {
      '/handlers/IntegrationApi': {
        target: 'https://xl4.xlombard.ru',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/handlers\/IntegrationApi(\/.*)?$/,
            '/372c/handlers/IntegrationApi/JsonRpc.ashx',
          ),
      },
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://xl4.xlombard.ru/372c/',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
})
