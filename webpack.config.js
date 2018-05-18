const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    js: './lib/chocolatechip.js',
  },
  output: {
    filename: './js/chocolatechip.js',
    path: path.join(__dirname, '/dist/'),
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    }, {
      test: /\.(png|jpg|jpeg|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: '/images/',
        },
      }],
    }],
  },
  devtool: 'eval',
};
