import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runAction } from '../src/runner.js';

const action = (command, extra = {}) => ({ command, timeoutSeconds: 5, env: {}, ...extra });

test('a successful program is ok and its output is captured', async () => {
  const result = await runAction(action(['/bin/sh', '-c', 'echo hello']));
  assert.equal(result.ok, true);
  assert.equal(result.output, 'hello');
});

test('a failing program reports its exit code and output', async () => {
  const result = await runAction(action(['/bin/sh', '-c', 'echo oops >&2; exit 3']));
  assert.deepEqual([result.ok, result.code, result.timedOut, result.output], [false, 3, false, 'oops']);
});

test('a program is stopped at its timeout', async () => {
  const result = await runAction(action(['/bin/sleep', '10'], { timeoutSeconds: 1 }));
  assert.equal(result.ok, false);
  assert.equal(result.timedOut, true);
});

test('arguments are passed literally, never through a shell', async () => {
  const result = await runAction(action(['/bin/echo', '$(id); rm -rf /']));
  assert.equal(result.output, '$(id); rm -rf /');
});

test('the agent environment does not leak; only the minimal set and the action env reach the program', async () => {
  process.env.QK_TEST_SECRET = 'leaked';
  const result = await runAction(action(['/usr/bin/env'], { env: { EXTRA: 'yes' } }));
  delete process.env.QK_TEST_SECRET;
  assert.match(result.output, /^EXTRA=yes$/m);
  assert.doesNotMatch(result.output, /QK_TEST_SECRET/);
});

test('a missing program is reported as a failure', async () => {
  const result = await runAction(action(['/nonexistent/program']));
  assert.equal(result.ok, false);
  assert.match(result.error, /ENOENT/);
});
