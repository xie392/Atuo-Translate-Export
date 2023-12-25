import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
// import vue from '@vitejs/plugin-vue'
import { CRX_BACKGROUND_OUTDIR } from './build/config'

export default defineConfig({
    // plugins: [
    //     vue(),
    // ],
    build: {
        outDir: CRX_BACKGROUND_OUTDIR,
        lib: {
            entry: fileURLToPath(new URL('./src/background/main.ts', import.meta.url)),
            name: 'content',
            formats: ['cjs'],
            fileName: () => {
                return 'background.js'
            }
        },
    },
})
