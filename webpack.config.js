const path = require('path');
const webpack = require('webpack');
module.exports = {
  context: path.resolve(__dirname, './'),
  entry: {
    app: './js/app.js',
  },
  output: {
    path: path.resolve(__dirname, './js'),
    filename: 'bundle.js',
  },
  externals: {
  	jquery: 'jQuery'
  }
};