const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './bundle.js',
    clean: true
  },
  externals: {
  	jquery: 'jQuery'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/js", to: "./js" },
        { from: "./src/css", to: "./css" },
        { from: "./src/index.html", to: "./index.html" }
      ]
    }),
  ],
};
