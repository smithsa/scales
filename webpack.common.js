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
        { from: "./src", to: "./" },
        { from: "./src/index.html", to: "./index.html" }
      ]
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'dist/'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.js$/,
        loader: "source-map-loader"
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
