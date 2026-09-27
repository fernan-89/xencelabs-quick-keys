import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateConfig } from '../src/config.js';
import { CONFIRM_WINDOW_MS, Controller, WHEEL_COOLDOWN_MS } from '../src/controller.js';

class FakeDevice {
  constructor() { this.calls = []; this.labels = []; this.overlays = []; }
  async setDisplayBrightness(v) { this.calls.push(['brightness', v]); }
  async setDisplayOrientation(v) { this.calls.push(['orientation', v]); }
  async setSleepTimeout(v) { this.calls.push(['sleep', v]); }
  async setKeyText(key, text) { this.labels[key] = text; }
  async setWheelColor(r, g, b) { this.color = [r, g, b]; }
  async showOverlayText(seconds, text) { this.overlays.push(text); }
}

const action = (label, extra = {}) => ({ label, command: ['/usr/bin/true'], ...extra });
const config = validateConfig({
  device: { brightness: 'full', orientation: 180 },
  controls: { button8: 'next-set', button9: 'previous-set' },
  sets: [
    { name: 'Stack', color: '#0000ff', keys: [action('Up'), null, action('Down', { confirm: true })] },
    { name: 'Net', color: '#00ff00', keys: [action('Diag')] },
    { name: 'Host', color: '#ff0000', keys: [action('Reboot', { confirm: true })] },
  ],
});

function setup({ run = async () => ({ ok: true, code: 0, output: '' }) } = {}) {
  let now = 1_000_000;
  const ran = [];
  const controller = new Controller(config, {
    run: async (a) => { ran.push(a.label); return run(a); },
    now: () => now,
    log: () => {},
  });
  const device = new FakeDevice();
  return { controller, device, ran, advance: (ms) => { now += ms; } };
}

test('attaching applies the device settings and shows the first set', async () => {
  const { controller, device } = setup();
  await controller.attach(device);
  assert.deepEqual(device.calls, [['brightness', 3], ['orientation', 3], ['sleep', 30]]);
  assert.deepEqual(device.labels, ['Up', '', 'Down', '', '', '', '', '']);
  assert.deepEqual(device.color, [0, 0, 255]);
  assert.deepEqual(device.overlays, ['Stack']);
});

test('a key runs its action and the display reports the result', async () => {
  const { controller, device, ran } = setup();
  await controller.attach(device);
  await controller.handleKeyDown(0);
  assert.deepEqual(ran, ['Up']);
  assert.deepEqual(device.overlays.slice(-2), ['Running: Up', 'OK: Up']);
});

test('failures and timeouts are shown as such', async () => {
  const results = [{ ok: false, code: 3, output: 'boom' }, { ok: false, code: null, timedOut: true, output: '' }];
  const { controller, device } = setup({ run: async () => results.shift() });
  await controller.attach(device);
  await controller.handleKeyDown(0);
  await controller.handleKeyDown(0);
  assert.deepEqual(device.overlays.filter((o) => !o.startsWith('Running')).slice(-2), ['FAILED (3): Up', 'TIMEOUT: Up']);
});

test('an action that throws is reported as failed and releases the pad', async () => {
  const { controller, device, ran } = setup({ run: async () => { throw new Error('spawn failed'); } });
  await controller.attach(device);
  await controller.handleKeyDown(0);
  assert.equal(device.overlays.at(-1), 'FAILED: Up');
  await controller.handleKeyDown(0);
  assert.deepEqual(ran, ['Up', 'Up']);
});

test('an empty key does nothing', async () => {
  const { controller, device, ran } = setup();
  await controller.attach(device);
  await controller.handleKeyDown(1);
  await controller.handleKeyDown(5);
  assert.deepEqual(ran, []);
});

test('a confirm action needs a second press within the window', async () => {
  const { controller, device, ran, advance } = setup();
  await controller.attach(device);
  await controller.handleKeyDown(2);
  assert.deepEqual(ran, []);
  assert.equal(device.overlays.at(-1), 'Press again: Down');
  advance(CONFIRM_WINDOW_MS + 1);
  await controller.handleKeyDown(2);
  assert.deepEqual(ran, [], 'the window expired, so this press asks again');
  advance(1000);
  await controller.handleKeyDown(2);
  assert.deepEqual(ran, ['Down']);
});

test('pressing another key cancels a pending confirmation', async () => {
  const { controller, device, ran } = setup();
  await controller.attach(device);
  await controller.handleKeyDown(2);
  await controller.handleKeyDown(0);
  await controller.handleKeyDown(2);
  assert.deepEqual(ran, ['Up']);
});

test('only one action runs at a time', async () => {
  let release;
  const { controller, device, ran } = setup({ run: () => new Promise((resolve) => { release = () => resolve({ ok: true, code: 0, output: '' }); }) });
  await controller.attach(device);
  const first = controller.handleKeyDown(0);
  await new Promise((r) => setImmediate(r));
  await controller.handleKeyDown(0);
  assert.equal(device.overlays.at(-1), 'Busy: Up');
  release();
  await first;
  assert.deepEqual(ran, ['Up']);
});

test('the wheel and the two buttons switch sets, wrapping around', async () => {
  const { controller, device, advance } = setup();
  await controller.attach(device);
  await controller.handleWheel('right');
  assert.equal(controller.currentSet.name, 'Net');
  assert.deepEqual(device.color, [0, 255, 0]);
  assert.equal(device.labels[0], 'Diag');
  await controller.handleWheel('right');
  assert.equal(controller.currentSet.name, 'Net', 'turns inside the cooldown are ignored');
  advance(WHEEL_COOLDOWN_MS);
  await controller.handleWheel('left');
  assert.equal(controller.currentSet.name, 'Stack');
  await controller.handleKeyDown(9);
  assert.equal(controller.currentSet.name, 'Host', 'previous from the first set wraps to the last');
  await controller.handleKeyDown(8);
  assert.equal(controller.currentSet.name, 'Stack');
});

test('switching sets cancels a pending confirmation', async () => {
  const { controller, device, ran } = setup();
  await controller.attach(device);
  await controller.handleKeyDown(2);
  await controller.handleKeyDown(8);
  await controller.handleKeyDown(9);
  await controller.handleKeyDown(2);
  assert.deepEqual(ran, []);
});

test('a device error is logged, not thrown', async () => {
  const logs = [];
  const controller = new Controller(config, { run: async () => ({ ok: true }), log: (m) => logs.push(m) });
  const broken = new FakeDevice();
  broken.setKeyText = async () => { throw new Error('unplugged'); };
  await controller.attach(broken);
  assert.ok(logs.some((m) => m.includes('unplugged')));
});
