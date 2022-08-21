import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            "/api": {
                target: "https://textsentiment-3arqmo4jra-as.a.run.app",
            },
            "/create_bucket": {
                target: "https://textsentiment-3arqmo4jra-as.a.run.app",
            },
            "/update_journal": {
                target: "https://textsentiment-3arqmo4jra-as.a.run.app",
            },
            "/update": {
                target: "https://textsentiment-3arqmo4jra-as.a.run.app",
            }
        }
    }
})
