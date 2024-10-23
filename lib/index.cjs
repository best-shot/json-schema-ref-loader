'use strict';

const parse = require('./parse.cjs');

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    before: {
      instanceof: 'Function',
    },
    after: {
      instanceof: 'Function',
    },
  },
};

module.exports = function loader(source) {
  this.cacheable();

  const { before, after } = this.getOptions(schema) || {};

  const callback = this.async();

  const { resourcePath } = this;

  let data = '';

  function callData(io) {
    callback(null, JSON.stringify(after ? after(io) : io));
  }

  try {
    data = JSON.parse(source);

    if (before) {
      data = before(data);
    }

    if (data) {
      parse({ data, resourcePath })
        .then((io) => {
          callData(io);
        })
        .catch((error) => {
          callback(error);
        });
    } else {
      callData(data);
    }
  } catch (error) {
    callback(error);
  }
};
