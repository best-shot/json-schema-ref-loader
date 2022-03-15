'use strict';

const { resolve, relative } = require('path');
const { readFile } = require('fs/promises');
const $refParser = require('@apidevtools/json-schema-ref-parser');

const cwd = process.cwd();

function parse(data, transformUrl) {
  return $refParser.bundle(data, {
    resolve: {
      file: {
        order: 1,
        canRead: true,
        read(file) {
          const url = transformUrl(file.url);

          return readFile(url, 'utf8');
        },
      },
    },
  });
}

module.exports = function loader(source) {
  this.cacheable();

  const callback = this.async();

  const { context } = this;

  let data = '';

  try {
    data = JSON.parse(source);

    if (data) {
      parse(data, (url) => resolve(context, relative(cwd, url)))
        .then((io) => {
          callback(null, JSON.stringify(io));
        })
        .catch((error) => {
          callback(error);
        });
    } else {
      callback(null, JSON.stringify(data));
    }
  } catch (error) {
    callback(error);
  }
};
