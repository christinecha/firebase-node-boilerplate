const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/scripts/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }
    ],
  },
}
