const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  mode: 'development',
  devtool: false,
  entry: './src/js/app.js',
  output: {
    // sourceMapFilename: '[name].js.map',
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.sass|scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // sourceMap: true,
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              // sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              // sourceMap: true,
            }
          }
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }]
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.pug$/i,
        loader: 'pug-loader',
        options: {
          attrs: ['img:src', 'link:href']
        }
      },
    ],
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({}),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.pug',
      filename: 'index.html',
    }),
  ],
};

module.exports = config;