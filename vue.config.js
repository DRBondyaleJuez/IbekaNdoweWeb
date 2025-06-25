const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    before(app) {
      app.get('/api/hello',(req,res)=> {
        res.json({message: 'Hello from dev server!'});
      });
    },
    proxy: {
      '/api/languages': {
        target:
        'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})
