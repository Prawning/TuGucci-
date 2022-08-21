import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8080",
            },
            "/create_bucket": {
                target: "http://localhost:8080",
            },
            "/update_journal": {
                target: "http://localhost:8080",
            }
        }
    }
})
