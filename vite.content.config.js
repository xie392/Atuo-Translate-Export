import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { CRX_CONTENT_OUTDIR } from './build/config'

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
        })
    ],
    build: {
        outDir: CRX_CONTENT_OUTDIR,
        assetsDir: '.',
        manifest: false,
        lib: {
            entry: fileURLToPath(new URL('./src/content/main.ts', import.meta.url)),
            name: 'content',
            formats: ['cjs'],
            fileName: () => {
                return 'content.js'
            }
        },
        rollupOptions: {
            output: {
                assetFileNames: () => {
                    return 'content.css'
                },
                // manualChunks(id) {
                //     // 下面这三行css代码打包的配置可以随你移除或者保留~移除后会自动生成一个css，和下面的示例图会有区别。
                //     if (id.includes("assets/styles/main.css")) {
                //         return "tailwindcss"
                //     }
                //     if (id.includes("element-plus/theme-chalk/")) { // 当然也可以优化下这个判断，不过目前这样写足矣了。
                //         return "element-plus"
                //     }
                // },
            }
        }
    },
    esbuild: {
        pure: ['console.log'], // 删除 console.log
        drop: ['debugger'], // 删除 debugger
    },
    define: {
        'process.env.NODE_ENV': null
    },
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./src/content', import.meta.url)),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
