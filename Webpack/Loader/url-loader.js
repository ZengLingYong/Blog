/**
 * 功能：文件大小限制，小于限制以 base64 插入文件，否则调用 file-loader 执行
 * 
 * 包依赖：
 * loader-utils
 * mime
 * file-loader
 */
let loaderUtls = require('loader-utils');
let mime = require('mime');

function loader(source) {
  let { limit } = loaderUtls.getOptions(this);
  
  if (limit && limit > source.length) {
    return `module.exports="data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
  } else {
    return require('file-loader').call(this, source)
  }

  return source;
}

loader.raw = true;

module.exports = loader;