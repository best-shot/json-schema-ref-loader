'use strict';

const { readFile } = require('node:fs/promises');
const $refParser = require('@apidevtools/json-schema-ref-parser');

module.exports = function parse({ data, resourcePath, dereference }) {
  const func = dereference ? 'dereference' : 'bundle';

  return $refParser[func](resourcePath, data, {
    resolve: {
      file: {
        order: 5,
        read(file, callback) {
          return readFile(file.url, 'utf8')
            .then((raw) => {
              callback(null, raw);
            })
            .catch((error) => {
              callback(error);
            });
        },
      },
    },
  });
};
