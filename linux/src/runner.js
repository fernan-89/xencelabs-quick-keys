// Runs one configured action: the program directly (no shell), a minimal environment, a timeout,
// and a bounded capture of its output for the journal.
import { execFile } from 'node:child_process';

const INHERITED_ENV = ['PATH', 'HOME', 'LANG', 'LC_ALL', 'USER', 'LOGNAME', 'XDG_RUNTIME_DIR'];
const OUTPUT_LIMIT = 4000;

function minimalEnv(extra) {
  const env = {};
  for (const name of INHERITED_ENV) {
    if (process.env[name] !== undefined) env[name] = process.env[name];
  }
  return { ...env, ...extra };
}

function tail(text) {
  return text.length > OUTPUT_LIMIT ? `…${text.slice(-OUTPUT_LIMIT)}` : text;
}

/**
 * @returns {Promise<{ok: boolean, code: number|null, signal: string|null, timedOut: boolean, output: string, error?: string}>}
 */
export function runAction(action, execFileImpl = execFile) {
  const [program, ...args] = action.command;
  return new Promise((resolve) => {
    execFileImpl(
      program,
      args,
      {
        cwd: action.cwd,
        env: minimalEnv(action.env),
        timeout: action.timeoutSeconds * 1000,
        killSignal: 'SIGTERM',
        maxBuffer: 1024 * 1024,
        windowsHide: true,
      },
      (error, stdout = '', stderr = '') => {
        const output = tail(`${stdout}${stderr}`.trim());
        if (!error) {
          resolve({ ok: true, code: 0, signal: null, timedOut: false, output });
          return;
        }
        const timedOut = error.killed === true && error.signal === 'SIGTERM';
        resolve({
          ok: false,
          code: typeof error.code === 'number' ? error.code : null,
          signal: error.signal ?? null,
          timedOut,
          output,
          error: typeof error.code === 'string' ? `${error.code}: ${error.message}` : undefined,
        });
      },
    );
  });
}
