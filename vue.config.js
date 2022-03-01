module.exports = {
  configureWebpack: {
    devServer: {
      proxy: {
        '/olympic': {
          target: 'http://sebastianszwarc.pl:9000',
          changeOrigin: true,
          pathRewrite: {
            '/olympic': ''
          }
        },
        '/dayoff': {
          target: 'https://isdayoff.ru',
          pathRewrite: {
            '/dayoff': ''
          }
        },
        '/city': {
          target: 'https://wft-geo-db.p.rapidapi.com/v1/geo',
        }
      },
      headers: { 'Access-Control-Allow-Origin': 'http://192.168.106.62:8082' }
    }
  }
}
