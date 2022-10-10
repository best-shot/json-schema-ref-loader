import test from 'ava';

import { resolvePath, run } from './helper/lib.mjs';

function resolve(path) {
  return resolvePath(path, import.meta.url);
}

test('base', async (t) => {
  const result = await run({
    resource: resolve('fixture/oas.json'),
    loader: resolve('../index.cjs'),
  });

  t.snapshot(JSON.parse(result.result));
});

test('nest', async (t) => {
  const result = await run({
    resource: resolve('fixture/qq/ref.json'),
    loader: resolve('../index.cjs'),
  });

  t.snapshot(JSON.parse(result.result));
});
