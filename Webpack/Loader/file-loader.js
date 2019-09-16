/**
 * file-loader
 * 功能：根据文件生成一个 md5 发射到输出目录，返回当前文件路径
 * 包依赖：loader-utils 
 */

let loaderUtils = require('loader-utils');

function loader(source) {
  let filename = loaderUtils.interpolateName(this, '[hash:8].[ext]', {content: source});

  this.emitFile(filename, source);    // 发射文件到输出目录
  return `module.exports = "${filename}"`;
}
loader.raw = true;    // source 已被转成二进制

module.exports = loader;