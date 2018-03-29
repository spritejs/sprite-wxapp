// const conf = require('./package.json')

module.exports = function (env = {}) {
  const fs = require('fs')

  const plugins = [],
    jsLoaders = []

  let path = 'app/lib'

  if(env.production) {
    path = 'dist'
    // compress js in production environment
    // plugins.push(new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false, // remove all comments
    //   },
    //   compress: {
    //     warnings: false,
    //     drop_console: false,
    //   },
    // }))
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
      // library: 'spritejs',
      libraryTarget: 'commonjs-module',
    },

    plugins,

    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: jsLoaders,
      }],
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
