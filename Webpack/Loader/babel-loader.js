/**
 * 包依赖：
 * @babel/core 
 * @babel/preset-env
 * loader-utils
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