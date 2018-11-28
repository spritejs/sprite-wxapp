// const conf = require('./package.json')
const webpack = require('webpack')

module.exports = function (env = {}) {
  const fs = require('fs')

  const plugins = [],
    jsLoaders = []

  let path = 'app/lib'

  if(env.target === 'game') {
    path = 'game/js/libs'
  }

  if(env.production) {
    path = 'dist'
    // compress js in production environment
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false, // remove all comments
      },
      compress: {
        warnings: false,
        drop_console: false,
      },
    }))
  }
  path = require('path').resolve(__dirname, path)

  if(fs.existsSync('./.babelrc')) {
    // use babel
    const babelConf = JSON.parse(fs.readFileSync('.babelrc'))
    jsLoaders.push({
      loader: 'babel-loader',
      options: babelConf,
    })
  }

  return {
    entry: './src/index.js',
    output: {
      filename: env.production ? 'sprite-wxapp.js' : 'spritejs.js',
      path,
      publicPath: '/js/',
      libraryTarget: 'commonjs-module',
      // library: 'spritejs',
      // libraryTarget: 'umd',
    },

    plugins,

    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: jsLoaders,
      }],
    },
    resolve: {
      aliasFields: ['default'],
    },
    // devServer: {
    //   open: true,
    //   proxy: {
    //     '*': `http://127.0.0.1:9091`,
    //   },
    // },
    // devtool: 'inline-source-map',
  }
}
