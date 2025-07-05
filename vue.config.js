const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api/languages': {
        target:
        'http://localhost:8081',
        changeOrigin: true
      },
      '/api/translated-word-content': {
        target:
        'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})

/*
    before(app) {
      app.get('/api/hello',(req,res)=> {
        res.json({message: 'Hello from dev server!'});
      });
    },
    */
