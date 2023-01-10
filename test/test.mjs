import test from 'ava';

import { diff, resolvePath, run } from './helper/lib.mjs';

function resolve(path) {
  return resolvePath(path, import.meta.url);
}

const loader = resolve('../index.cjs');

const oas = resolve('fixture/oas.json');

test('base', async (t) => {
  const { input, result } = await run({
    resource: oas,
    loader,
  });

  t.snapshot(diff(input, result));
});

test('nest', async (t) => {
  const { input, result } = await run({
    resource: resolve('fixture/qq/ref.json'),
    loader,
  });

  t.snapshot(diff(input, result));
});

test('parser', async (t) => {
  const { input, result } = await run({
    resource: oas,
    loader,
    options: {
      parser(data) {
        return { openapi: data.openapi };
      },
    },
  });

  t.snapshot(diff(input, result));
});

test('dereference', async (t) => {
  const { result: result1 } = await run({
    resource: oas,
    loader,
  });

  const { result: result2 } = await run({
    resource: oas,
    loader,
    options: {
      dereference: true,
    },
  });

  t.snapshot(diff(result1, result2));
});

test('dereference by data', async (t) => {
  const { result: result1 } = await run({
    resource: oas,
    loader,
    options: {
      dereference: ({ openapi }) => !openapi,
    },
  });

  const { result: result2 } = await run({
    resource: oas,
    loader,
    options: {
      dereference: ({ openapi }) => openapi,
    },
  });

  t.snapshot(diff(result1, result2));
});
