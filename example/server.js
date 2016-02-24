/* eslint-disable */
process.env.NODE_PATH =  __dirname + '/../..';
require('module').Module._initPaths();

require('source-map-support').install();

require('css-modules-require-hook')({
  generateScopedName: '[path][name]-[local]',
});
require('babel-register');

var express = require('express');
var path = require('path');
var pathExtras = require('node-path-extras');

var chokidar = require('chokidar');
var webpack = require('webpack');
var config = require('./webpack.config');
var compiler = webpack(config);

var app = express();

// Serve hot-reloading bundle to client
app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}));
app.use(require("webpack-hot-middleware")(compiler));

// Include server routes as a middleware
app.use(function(req, res, next) {
  require('./src/server/app')(req, res, next);
});

// Anything else gets passed to the client app's server rendering
app.get('*', function(req, res, next) {
  require('./src/server').default(req, res, next);
});

// Do "hot-reloading" of express stuff and react stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
var pathSrc = path.join(__dirname, 'src');
var pathLibDist = path.join(__dirname, '..', 'lib');

var watcher = chokidar.watch(['./src', '../lib']);

watcher.on('ready', function() {
  watcher.on('all', function() {
    console.log('Clearing module cache');
    Object.keys(require.cache).forEach(function(id) {
      if (pathExtras.contains(pathSrc, id) || pathExtras.contains(pathLibDist, id)) {
        console.log('Clearing module cache for file ' + id);
        delete require.cache[id];
      }
    });
  });
});

var http = require('http');
var server = http.createServer(app);
server.listen(3000, 'localhost', function(err) {
  if (err) throw err;

  var addr = server.address();

  console.log('Listening at http://%s:%d', addr.address, addr.port);
});
