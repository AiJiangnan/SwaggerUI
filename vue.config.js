'use strict';
module.exports = {
  devServer: {
    proxy: {
      '/': {
        // target: 'http://10.250.1.118:9000',
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: false
      }
    },
    // host: '127.0.0.1',
    port: 9080
  },
  productionSourceMap: false
};
