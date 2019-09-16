/**
 * banner-loader
 * 功能：向输出文件添加注释内容
 * 包依赖：
 * 1. loader-utils
 * 2. schema-utils 验证 options 参数
 */

let loaderUtls = require('loader-utils');
let validateOptions = require('schema-utils');
let fs = require('fs');

function loader(source) {
  this.cacheable && this.cacheable(false); // 不开启缓存
  let cb = this.async();
  let options = loaderUtls.getOptions(this);
  let schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string',
      },
      filename: {
        type: 'string'
      }
    }
  }  
  validateOptions(schema, options, 'banner-loader');

  if (options.filename) {
    // 将文件加入依赖，文件变化 webpack 会重新打包
    this.addDependency(options.filename);
    fs.readFile(options.filename, 'utf8', (err, data) => {
      cb(err, `/**${data}**/${source}`);
    })
  } else {
    cb(null, `/**${options.text}**/${source}`);
  }
}

module.exports = loader;