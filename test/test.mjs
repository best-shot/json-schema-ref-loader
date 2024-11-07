import test from 'ava';

import { diff, resolvePath, run } from './helper/lib.mjs';

function resolve(path) {
  return resolvePath(path, import.meta.url);
}

const loader = resolve('../lib/index.cjs');

const oas = resolve('fixture/oas.json');

const selfRef = resolve('fixture/self.json');

test.serial('base', async (t) => {
  const { input, result } = await run({
    resource: oas,
    loader,
  });

  t.snapshot(diff(input, result));
});

test.serial('nest', async (t) => {
  const { input, result } = await run({
    resource: resolve('fixture/qq/ref.json'),
    loader,
  });

  t.snapshot(diff(input, result));
});

test.serial('before', async (t) => {
  const { input, result } = await run({
    resource: oas,
    loader,
    options: {
      before(data) {
        delete data.openapi;

        return data;
      },
    },
  });

  t.snapshot(diff(input, result));
});

test.serial('after', async (t) => {
  const { input, result } = await run({
    resource: oas,
    loader,
    options: {
      after(data) {
        return data.paths;
      },
    },
  });

  t.snapshot(diff(input, result));
});

test.serial('self', async (t) => {
  const { input, result } = await run({
    resource: selfRef,
    loader,
    options: {
      dereference: false,
    },
  });

  t.snapshot(diff(input, result));
});
