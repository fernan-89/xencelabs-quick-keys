// The agent's behaviour, independent of the USB library so it can be tested with a fake device:
// which set is active, what each key does, confirmation of sensitive actions, one action at a time,
// and what the display shows.
const ORIENTATION = { 0: 1, 90: 2, 180: 3, 270: 4 }; // XencelabsQuickKeysDisplayOrientation
const BRIGHTNESS = { off: 0, low: 1, medium: 2, full: 3 }; // XencelabsQuickKeysDisplayBrightness
export const CONFIRM_WINDOW_MS = 3000;
export const WHEEL_COOLDOWN_MS = 350;
const FEEDBACK_SECONDS = 3;

export class Controller {
  /**
   * @param {object} config validated configuration (see config.js)
   * @param {{run: Function, now?: Function, log?: Function}} deps
   */
  constructor(config, { run, now = Date.now, log = console.log }) {
    this.config = config;
    this.run = run;
    this.now = now;
    this.log = log;
    this.devices = new Set();
    this.setIndex = 0;
    this.running = null; // label of the action in progress
    this.pendingConfirm = null; // { setIndex, keyIndex, until }
    this.lastWheelAt = -Infinity;
  }

  get currentSet() {
    return this.config.sets[this.setIndex];
  }

  async attach(device) {
    this.devices.add(device);
    const { brightness, orientation, sleepMinutes } = this.config.device;
    await this.#safely(device, (d) => d.setDisplayBrightness(BRIGHTNESS[brightness]));
    await this.#safely(device, (d) => d.setDisplayOrientation(ORIENTATION[orientation]));
    await this.#safely(device, (d) => d.setSleepTimeout(sleepMinutes));
    await this.#render([device], true);
  }

  detach(device) {
    this.devices.delete(device);
  }

  async handleKeyDown(keyIndex) {
    if (keyIndex === 8 || keyIndex === 9) {
      await this.#control(this.config.controls[`button${keyIndex}`]);
      return;
    }
    const action = this.currentSet.keys[keyIndex];
    if (!action) return;

    if (this.running) {
      await this.#overlay(`Busy: ${this.running}`);
      return;
    }
    if (action.confirm) {
      const pending = this.pendingConfirm;
      const confirmed = pending && pending.setIndex === this.setIndex && pending.keyIndex === keyIndex && this.now() <= pending.until;
      if (!confirmed) {
        this.pendingConfirm = { setIndex: this.setIndex, keyIndex, until: this.now() + CONFIRM_WINDOW_MS };
        await this.#overlay(`Press again: ${action.label}`);
        return;
      }
    }
    this.pendingConfirm = null;
    await this.#execute(action);
  }

  async handleWheel(direction) {
    if (this.config.controls.wheel !== 'sets') return;
    const now = this.now();
    if (now - this.lastWheelAt < WHEEL_COOLDOWN_MS) return;
    this.lastWheelAt = now;
    await this.#control(direction === 'right' ? 'next-set' : 'previous-set');
  }

  async #control(action) {
    if (action === 'none' || this.config.sets.length === 1) return;
    const count = this.config.sets.length;
    this.setIndex = (this.setIndex + (action === 'next-set' ? 1 : count - 1)) % count;
    this.pendingConfirm = null;
    await this.#render([...this.devices], true);
  }

  async #execute(action) {
    this.running = action.label;
    this.log(`[action] ${this.currentSet.name}/${action.label}: ${action.command.join(' ')}`);
    await this.#overlay(`Running: ${action.label}`);
    let result;
    try {
      result = await this.run(action);
    } catch (error) {
      result = { ok: false, code: null, signal: null, timedOut: false, output: '', error: String(error) };
    } finally {
      this.running = null;
    }
    const outcome = result.ok
      ? 'OK'
      : result.timedOut
        ? 'TIMEOUT'
        : result.code !== null
          ? `FAILED (${result.code})`
          : 'FAILED';
    this.log(`[action] ${action.label}: ${outcome}${result.error ? ` ${result.error}` : ''}${result.output ? `\n${result.output}` : ''}`);
    await this.#overlay(`${outcome}: ${action.label}`);
    return result;
  }

  async #render(devices, announce) {
    const set = this.currentSet;
    for (const device of devices) {
      for (let key = 0; key < set.keys.length; key++) {
        await this.#safely(device, (d) => d.setKeyText(key, set.keys[key]?.label ?? ''));
      }
      await this.#safely(device, (d) => d.setWheelColor(...set.color));
      if (announce) await this.#safely(device, (d) => d.showOverlayText(2, set.name));
    }
  }

  async #overlay(text) {
    for (const device of this.devices) {
      await this.#safely(device, (d) => d.showOverlayText(FEEDBACK_SECONDS, text.slice(0, 32)));
    }
  }

  async #safely(device, call) {
    try {
      await call(device);
    } catch (error) {
      this.log(`[device] ${error?.message ?? error}`);
    }
  }
}
