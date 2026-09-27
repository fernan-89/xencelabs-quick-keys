import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chmodSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ConfigError, loadConfig, validateConfig } from '../src/config.js';

const key = (overrides = {}) => ({ label: 'Up', command: ['/usr/bin/true'], ...overrides });
const config = (overrides = {}) => ({ sets: [{ name: 'Main', keys: [key()] }], ...overrides });

test('the example configuration is valid', () => {
  const path = new URL('../config.example.yml', import.meta.url).pathname;
  chmodSync(path, 0o644);
  const loaded = loadConfig(path);
  assert.equal(loaded.sets.length, 3);
  assert.deepEqual(loaded.sets[0].color, [0x1e, 0x90, 0xff]);
  assert.equal(loaded.sets[0].keys[7].confirm, true);
});

test('defaults are applied and every set is padded to 8 keys', () => {
  const loaded = validateConfig(config());
  assert.deepEqual(loaded.device, { brightness: 'medium', orientation: 0, sleepMinutes: 30 });
  assert.deepEqual(loaded.controls, { wheel: 'sets', button8: 'next-set', button9: 'none' });
  assert.equal(loaded.sets[0].keys.length, 8);
  assert.deepEqual(loaded.sets[0].keys[0], { label: 'Up', command: ['/usr/bin/true'], cwd: undefined, env: {}, timeoutSeconds: 60, confirm: false });
  assert.equal(loaded.sets[0].keys[1], null);
});

for (const [name, bad, message] of [
  ['a relative program', config({ sets: [{ name: 'M', keys: [key({ command: ['docker', 'ps'] })] }] }), /absolute path/],
  ['a shell string instead of a list', config({ sets: [{ name: 'M', keys: [key({ command: '/usr/bin/docker ps' })] }] }), /list of strings/],
  ['a label longer than the display', config({ sets: [{ name: 'M', keys: [key({ label: 'TooLongLabel' })] }] }), /longer than 8/],
  ['more than 8 keys', config({ sets: [{ name: 'M', keys: Array(9).fill(key()) }] }), /1 to 8 keys/],
  ['an unknown setting', config({ sets: [{ name: 'M', keys: [key({ shell: true })] }] }), /unknown setting "shell"/],
  ['duplicate set names', config({ sets: [{ name: 'M', keys: [key()] }, { name: 'M', keys: [key()] }] }), /used by another set/],
  ['a bad color', config({ sets: [{ name: 'M', color: 'blue', keys: [key()] }] }), /color like/],
  ['a relative cwd', config({ sets: [{ name: 'M', keys: [key({ cwd: 'opt' })] }] }), /absolute path/],
  ['a timeout out of range', config({ sets: [{ name: 'M', keys: [key({ timeoutSeconds: 0 })] }] }), /between 1 and 3600/],
  ['an unknown button action', config({ controls: { button8: 'reboot' } }), /controls.button8/],
  ['no sets', { sets: [] }, /non-empty list/],
]) {
  test(`rejects ${name}`, () => assert.throws(() => validateConfig(bad), (error) => error instanceof ConfigError && message.test(error.message)));
}

test('refuses a configuration file that group or others can modify', () => {
  const path = join(mkdtempSync(join(tmpdir(), 'qk-')), 'config.yml');
  writeFileSync(path, 'sets:\n  - name: M\n    keys:\n      - {label: Up, command: [/usr/bin/true]}\n');
  chmodSync(path, 0o664);
  assert.throws(() => loadConfig(path), /writable by group or others/);
  chmodSync(path, 0o600);
  assert.equal(loadConfig(path).sets[0].name, 'M');
});

test('reports invalid YAML as a configuration error', () => {
  const path = join(mkdtempSync(join(tmpdir(), 'qk-')), 'config.yml');
  writeFileSync(path, 'sets: [unclosed');
  chmodSync(path, 0o600);
  assert.throws(() => loadConfig(path), /invalid YAML/);
});
