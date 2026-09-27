// Loads and validates the agent's YAML configuration. Everything the agent may execute comes from
// this file, so it is validated strictly and refused if other users can modify it.
import { readFileSync, statSync } from 'node:fs';
import { isAbsolute } from 'node:path';
import { parse } from 'yaml';

export const KEYS_PER_SET = 8;
export const MAX_LABEL_LENGTH = 8;
const BUTTON_ACTIONS = ['next-set', 'previous-set', 'none'];
const WHEEL_ACTIONS = ['sets', 'none'];
const ORIENTATIONS = [0, 90, 180, 270];
const BRIGHTNESS = ['off', 'low', 'medium', 'full'];

export class ConfigError extends Error {}

function fail(path, message) {
  throw new ConfigError(`${path}: ${message}`);
}

function checkKeys(object, allowed, path) {
  for (const key of Object.keys(object)) {
    if (!allowed.includes(key)) fail(path, `unknown setting "${key}" (allowed: ${allowed.join(', ')})`);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseColor(value, path) {
  const match = typeof value === 'string' && /^#([0-9a-fA-F]{6})$/.exec(value);
  if (!match) fail(path, 'must be a color like "#1e90ff"');
  const hex = match[1];
  return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
}

function validateAction(action, path) {
  if (!isPlainObject(action)) fail(path, 'must be a mapping with at least "label" and "command"');
  checkKeys(action, ['label', 'command', 'cwd', 'env', 'timeoutSeconds', 'confirm'], path);

  const { label, command } = action;
  if (typeof label !== 'string' || label.trim() === '') fail(`${path}.label`, 'must be a non-empty string');
  if (label.length > MAX_LABEL_LENGTH) fail(`${path}.label`, `"${label}" is longer than ${MAX_LABEL_LENGTH} characters, the most the key display shows`);
  if (!Array.isArray(command) || command.length === 0 || !command.every((part) => typeof part === 'string' && part !== '')) {
    fail(`${path}.command`, 'must be a non-empty list of strings: the program and its arguments (no shell is used)');
  }
  if (!isAbsolute(command[0])) fail(`${path}.command`, `the program "${command[0]}" must be an absolute path, so PATH cannot redirect it`);
  if (action.cwd !== undefined && (typeof action.cwd !== 'string' || !isAbsolute(action.cwd))) fail(`${path}.cwd`, 'must be an absolute path');
  if (action.env !== undefined) {
    if (!isPlainObject(action.env) || !Object.values(action.env).every((value) => typeof value === 'string')) {
      fail(`${path}.env`, 'must map variable names to string values');
    }
  }
  const timeoutSeconds = action.timeoutSeconds ?? 60;
  if (!Number.isInteger(timeoutSeconds) || timeoutSeconds < 1 || timeoutSeconds > 3600) fail(`${path}.timeoutSeconds`, 'must be an integer between 1 and 3600');
  if (action.confirm !== undefined && typeof action.confirm !== 'boolean') fail(`${path}.confirm`, 'must be true or false');

  return {
    label,
    command: [...command],
    cwd: action.cwd,
    env: { ...(action.env ?? {}) },
    timeoutSeconds,
    confirm: action.confirm === true,
  };
}

/** Validates a parsed configuration object and returns it normalized, with defaults applied. */
export function validateConfig(raw) {
  if (!isPlainObject(raw)) fail('config', 'must be a mapping');
  checkKeys(raw, ['device', 'controls', 'sets'], 'config');

  const device = raw.device ?? {};
  if (!isPlainObject(device)) fail('device', 'must be a mapping');
  checkKeys(device, ['brightness', 'orientation', 'sleepMinutes'], 'device');
  const brightness = device.brightness ?? 'medium';
  if (!BRIGHTNESS.includes(brightness)) fail('device.brightness', `must be one of ${BRIGHTNESS.join(', ')}`);
  const orientation = device.orientation ?? 0;
  if (!ORIENTATIONS.includes(orientation)) fail('device.orientation', `must be one of ${ORIENTATIONS.join(', ')}`);
  const sleepMinutes = device.sleepMinutes ?? 30;
  if (!Number.isInteger(sleepMinutes) || sleepMinutes < 1 || sleepMinutes > 255) fail('device.sleepMinutes', 'must be an integer between 1 and 255');

  const controls = raw.controls ?? {};
  if (!isPlainObject(controls)) fail('controls', 'must be a mapping');
  checkKeys(controls, ['wheel', 'button8', 'button9'], 'controls');
  const wheel = controls.wheel ?? 'sets';
  if (!WHEEL_ACTIONS.includes(wheel)) fail('controls.wheel', `must be one of ${WHEEL_ACTIONS.join(', ')}`);
  const button8 = controls.button8 ?? 'next-set';
  const button9 = controls.button9 ?? 'none';
  for (const [name, value] of [['button8', button8], ['button9', button9]]) {
    if (!BUTTON_ACTIONS.includes(value)) fail(`controls.${name}`, `must be one of ${BUTTON_ACTIONS.join(', ')}`);
  }

  if (!Array.isArray(raw.sets) || raw.sets.length === 0) fail('sets', 'must be a non-empty list');
  const names = new Set();
  const sets = raw.sets.map((set, index) => {
    const path = `sets[${index}]`;
    if (!isPlainObject(set)) fail(path, 'must be a mapping with "name" and "keys"');
    checkKeys(set, ['name', 'color', 'keys'], path);
    if (typeof set.name !== 'string' || set.name.trim() === '') fail(`${path}.name`, 'must be a non-empty string');
    if (set.name.length > 32) fail(`${path}.name`, 'must be at most 32 characters, the most the overlay shows');
    if (names.has(set.name)) fail(`${path}.name`, `"${set.name}" is used by another set`);
    names.add(set.name);
    const color = parseColor(set.color ?? '#ffffff', `${path}.color`);
    if (!Array.isArray(set.keys) || set.keys.length === 0 || set.keys.length > KEYS_PER_SET) {
      fail(`${path}.keys`, `must list 1 to ${KEYS_PER_SET} keys (K1 to K8, in order; use null to leave a key empty)`);
    }
    const keys = set.keys.map((action, keyIndex) => (action === null ? null : validateAction(action, `${path}.keys[${keyIndex}]`)));
    while (keys.length < KEYS_PER_SET) keys.push(null);
    return { name: set.name, color, keys };
  });

  return { device: { brightness, orientation, sleepMinutes }, controls: { wheel, button8, button9 }, sets };
}

/**
 * Reads, checks and validates the configuration file. The file decides which programs run, so it
 * must not be writable by group or others.
 */
export function loadConfig(path) {
  const mode = statSync(path).mode;
  if (mode & 0o022) {
    throw new ConfigError(`${path}: is writable by group or others (mode ${(mode & 0o777).toString(8)}); run chmod 644 or 600 on it`);
  }
  let raw;
  try {
    raw = parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new ConfigError(`${path}: invalid YAML: ${error.message}`);
  }
  return validateConfig(raw);
}
