import { parse } from './parse.mjs';
import { load as yamlLoad } from 'js-yaml';
import { extname } from 'node:path';

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
      type: 'boolean',
      default: true,
    },
  },
};

function tryParseSource(src, resourcePath) {
  const ext = resourcePath ? extname(resourcePath).toLowerCase() : '';

  if (ext === '.yaml' || ext === '.yml') {
    try {
      return yamlLoad(src);
    } catch (error) {
      throw new Error(`Failed to parse as YAML: ${error.message}`);
    }
  }

  return JSON.parse(src);
}

export default function loader(source) {
  this.cacheable();

  const { before, after, dereference } = this.getOptions(schema) || {};

  const callback = this.async();

  const { resourcePath } = this;

  let data = '';

  function callData(io) {
    callback(null, JSON.stringify(after ? after(io) : io));
  }

  try {
    data = tryParseSource(source, resourcePath);

    if (before) {
      data = before(data);
    }

    if (data) {
      parse({ data, resourcePath, dereference })
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
}
