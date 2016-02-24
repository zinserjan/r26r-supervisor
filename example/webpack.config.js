/*eslint-disable */
var path = require('path');
var qs = require('querystring');
var webpack = require('webpack');
process.env.NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/client.js'
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js',
    chunkFilename: '[id].chunk.js',
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 50000
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  resolve: {
    extensions: ['', '.js'],
    alias: {
      'r26r-supervisor': path.join(__dirname, '..')
    }
  },
  module: {
    loaders: [
      // Javascript
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        query: {
          "env": {
            "development": {
              "presets": ["react-hmre"],
              "plugins": [
                ["react-transform", {
                  "transforms": [{
                    "transform": "react-transform-hmr",
                    "imports": ["react"],
                    "locals": ["module"]
                  }]
                }]
              ]
            }
          }
        }
      },

      // CSS
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src'),
        loader: 'style-loader!css-loader?' + qs.stringify({
          modules: true,
          importLoaders: 1,
          localIdentName: '[path][name]-[local]'
        })
      }

    ]
  }
};
