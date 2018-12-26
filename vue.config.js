'use strict';
module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'https://petstore.swagger.io',
        // target: 'http://localhost:8080',
        changeOrigin: true,
        ws: false
      }
    },
    host: 'localhost',
    port: 9080
  }
};
