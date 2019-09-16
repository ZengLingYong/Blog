/**
 * babel-loader
 * 功能：转化 ES6
 * 包依赖：
 * 1. @babel/core 
 * 2. @babel/preset-env
 * 3. loader-utils
 */

let babel = require('@babel/core');
let loaderUtils = require('loader-utils');

function loader(source) {
  let options = loaderUtils.getOptions(this);
  let cb = this.async();
  babel.transform(source, {
    ...options,
    filename: this.resourcePath.split('/').pop(),
    sourceMaps: true
  }, (err, result) => {
    cb(null, result.code, result.map);
  })
}

module.exports = loader;