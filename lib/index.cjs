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
    dereference: {
      default: false,
      oneOf: [
        {
          type: 'boolean',
        },
        {
          instanceof: 'Function',
        },
      ],
    },
  },
};

module.exports = function loader(source) {
  this.cacheable();

  const { before, after, dereference } = this.getOptions(schema) || {};

  const callback = this.async();

  const { resourcePath } = this;

  let data = '';

  function callData(io) {
    callback(null, JSON.stringify(after ? after(io) : io));
  }

  try {
    data = JSON.parse(source);

    const should = Boolean(
      typeof dereference === 'function' ? dereference(data) : dereference,
    );

    if (before) {
      data = before(data);
    }

    if (data) {
      parse({ data, resourcePath, dereference: should })
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
