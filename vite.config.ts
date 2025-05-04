import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    adonisjs({
      entrypoints: ['resources/css/app.scss', 'resources/js/app.js'],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import 'bootstrap/scss/bootstrap';
                         $bootstrap-icons-font-dir: 'bootstrap-icons/font/fonts/';
                         @import 'bootstrap-icons/font/bootstrap-icons.scss';`,
      },
    },
  },
})
