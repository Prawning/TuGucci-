const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    devServer: {
        proxy: {
            target: "localhost:8080",
        }
    }
})