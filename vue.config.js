'use strict';
module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'http://10.250.1.110:8905',
        changeOrigin: true,
        ws: false
      }
    },
    host: 'localhost',
    port: 9080
  }
};
