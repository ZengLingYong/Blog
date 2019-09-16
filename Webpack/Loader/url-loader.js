/**
 * url-loader
 * 功能：小于限制以 base64 插入文件，否则调用 file-loader 执行
 * 包依赖：
 * 1. loader-utils
 * 2. mime
 * 3. file-loader
 */

const loaderUtls = require('loader-utils');
const mime = require('mime');

function loader(source) {
  const { limit } = loaderUtls.getOptions(this);
  
  if (limit && limit > source.length) {
    return `module.exports="data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
  } else {
    return require('file-loader').call(this, source)
  }
}

loader.raw = true;  // source 已被转成二进制

module.exports = loader;