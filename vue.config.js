'use strict';
module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: false
      }
    },
    host: 'localhost',
    port: 9080
  }
};
