#!/usr/bin/env node

const webpack = require('webpack');

const webpackConf = require('../webpack.config.js');

function buildTask(options = {}) {
  return new Promise((resolve, reject) => {
    webpack(webpackConf(options), (err, status) => {
      if(err) reject(err);
      else {
        resolve(status);
      }
    });
  });
}

(async function () {
  await buildTask({production: true}); // build compressed file
}());
