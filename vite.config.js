import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpg: {
        quality: 82,
      },
      jpeg: {
        quality: 82,
      },
      webp: {
        lossless: false,
        quality: 82,
      },
      includePublic: true,
    }),
  ],
  assetsInclude: ['**/*.JPG', '**/*.JPEG', '**/*.PNG', '**/*.GIF', '**/*.WEBP'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
