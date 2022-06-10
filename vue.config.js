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
        '/geo': {
          target: 'https://wft-geo-db.p.rapidapi.com/v1/geo',
          pathRewrite: {
            '/geo': ''
          },
          changeOrigin: false
        },
        '/suggestions': {
          target: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest',
          changeOrigin: true,
          pathRewrite: {
            '/suggestions': ''
          }
        },
        '/local': {
          target: 'https://localhost:5001/',
          pathRewrite: {
            '/local': ''
          }
        }
      },
      headers: { 'Access-Control-Allow-Origin': 'http://localhost:8082' }
    }
  }
}
