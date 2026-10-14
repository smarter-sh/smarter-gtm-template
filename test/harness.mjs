/**
 * Runs template.tpl's sandboxed code, and its ___TESTS___ scenarios, in Node, with fakes of Google Tag Manager's
 * sandbox apis. See skills/smarter-gtm-testing and doc/adr/007-testing.md.
 *
 * The fakes follow GTM's documented behavior, and enforce the template's declared permissions: an api without its
 * permission throws when it is required, and a global variable without read, write or execute access throws when it
 * is used, as GTM does. A scenario that needs an api that isn't here must add it here first.
 */
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import vm from "node:vm";
import YAML from "yaml";

export const TEMPLATE = path.resolve(import.meta.dirname, "../template.tpl");

/** The sections of template.tpl, by name, e.g. sections()["___INFO___"]. */
export function sections(file = TEMPLATE) {
  const result = {};
  const parts = fs.readFileSync(file, "utf-8").split(/^(___[A-Z_]+___)$/m);
  for (let i = 1; i < parts.length; i += 2) result[parts[i]] = parts[i + 1].trim();
  return result;
}

export const SECTION_NAMES = [
  "___TERMS_OF_SERVICE___",
  "___INFO___",
  "___TEMPLATE_PARAMETERS___",
  "___SANDBOXED_JS_FOR_WEB_TEMPLATE___",
  "___WEB_PERMISSIONS___",
  "___TESTS___",
  "___NOTES___",
];

/** The template's code, its parameters, permissions and tests, parsed. */
export function template(file = TEMPLATE) {
  const all = sections(file);
  return {
    sections: all,
    info: JSON.parse(all.___INFO___),
    parameters: JSON.parse(all.___TEMPLATE_PARAMETERS___),
    permissions: JSON.parse(all.___WEB_PERMISSIONS___),
    code: all.___SANDBOXED_JS_FOR_WEB_TEMPLATE___,
    tests: YAML.parse(all.___TESTS___),
  };
}

/** A permission's parameters, as plain values: {publicId: {param: value}}. */
export function permissionValues(permissions) {
  const value = (v) => {
    if (v.type === 1) return v.string;
    if (v.type === 8) return v.boolean;
    if (v.type === 2) return v.listItem.map(value);
    if (v.type === 3) return Object.fromEntries(v.mapKey.map((key, i) => [value(key), value(v.mapValue[i])]));
    throw new Error(`unknown permission value type ${v.type}`);
  };
  return Object.fromEntries(
    permissions.map(({ instance }) => [
      instance.key.publicId,
      Object.fromEntries((instance.param ?? []).map((param) => [param.key, value(param.value)])),
    ]),
  );
}

/** Whether a url matches one of GTM's url match patterns, in which * matches anything. */
export function urlMatches(url, patterns) {
  return patterns.some((pattern) => new RegExp(`^${pattern.split("*").map(escapeRegExp).join(".*")}$`).test(url));
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** GTM's getType(). */
function getType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

// The template's code, as a file that Node runs and V8 measures the coverage of: generated, and gitignored.
const COMPILED = path.resolve(import.meta.dirname, ".compiled/template.js");
const compiled = new Map();

/**
 * The template's code as a function of data and require. It runs from COMPILED, padded so that its lines are
 * template.tpl's: the coverage report's lines are the template's (codecov.yml maps the file to template.tpl).
 */
function compile(code) {
  if (!compiled.has(code)) {
    const text = fs.readFileSync(TEMPLATE, "utf-8");
    const offset = text.indexOf(code);
    let filename = "template.js";
    let padding = "\n";
    if (offset >= 0) {
      filename = COMPILED;
      padding = "\n".repeat(text.slice(0, offset).split("\n").length - 1);
    }
    const source = `(function (data, require) {${padding}${code}\n})\n`;
    if (filename === COMPILED) {
      fs.mkdirSync(path.dirname(COMPILED), { recursive: true });
      fs.writeFileSync(COMPILED, source);
    }
    compiled.set(code, vm.runInThisContext(source, { filename }));
  }
  return compiled.get(code);
}

/** The permission that each api needs, or null for the apis that need none. */
const API_PERMISSIONS = {
  callInWindow: "access_globals",
  copyFromWindow: "access_globals",
  encodeUriComponent: null,
  getType: null,
  injectScript: "inject_script",
  logToConsole: "logging",
  queryPermission: null,
  setInWindow: "access_globals",
};

/** The value at a dotted path of an object, e.g. "SmarterChat.version". */
function at(object, key) {
  return key.split(".").reduce((node, part) => (node == null ? undefined : node[part]), object);
}

/**
 * A run of the template: its fake window, its calls, its mocks, and the GTM apis of its tests.
 */
export class Run {
  constructor({ code, permissions }) {
    this.code = code;
    this.permissions = permissionValues(permissions);
    this.window = {};
    this.calls = {};
    this.mocks = {};
    this.logs = [];
  }

  record(name, args) {
    (this.calls[name] ??= []).push(args);
  }

  globalAccess(key, access) {
    const keys = this.permissions.access_globals?.keys ?? [];
    if (!keys.some((entry) => entry.key === key && entry[access])) {
      throw new Error(`access_globals: no ${access} permission for ${key}`);
    }
  }

  /** The real (fake) implementation of an api, before mocks. */
  api(name) {
    const run = this;
    const apis = {
      callInWindow(key, ...args) {
        run.globalAccess(key, "execute");
        const fn = at(run.window, key);
        return typeof fn === "function" ? structuredClone(fn(...args.map((arg) => structuredClone(arg)))) : undefined;
      },
      copyFromWindow(key) {
        run.globalAccess(key, "read");
        const value = at(run.window, key);
        return typeof value === "function" ? undefined : structuredClone(value);
      },
      encodeUriComponent: (value) => encodeURIComponent(value),
      getType,
      injectScript(url, onSuccess) {
        if (!urlMatches(url, run.permissions.inject_script?.urls ?? []))
          throw new Error(`inject_script: ${url} is not permitted`);
        onSuccess();
      },
      logToConsole: (...args) => run.logs.push(args),
      queryPermission(permission, ...args) {
        if (permission === "inject_script") return urlMatches(args[0], run.permissions.inject_script?.urls ?? []);
        throw new Error(`queryPermission: the harness doesn't fake ${permission} yet`);
      },
      setInWindow(key, value, overrideExisting) {
        run.globalAccess(key, "write");
        if (at(run.window, key) !== undefined && !overrideExisting) return false;
        run.window[key] = structuredClone(value);
        return true;
      },
    };
    return apis[name];
  }

  /** GTM's require(), recording every call, with mocks first. */
  require(name) {
    if (!(name in API_PERMISSIONS)) throw new Error(`require: the harness doesn't fake ${name} yet`);
    const permission = API_PERMISSIONS[name];
    if (permission && !this.permissions[permission])
      throw new Error(`require('${name}') needs the ${permission} permission`);
    return (...args) => {
      this.record(name, args);
      const implementation = this.mocks[name] ?? this.api(name);
      return implementation(...args);
    };
  }

  /** Runs the template's code with data, whose gtmOnSuccess and gtmOnFailure are recorded. */
  runCode(data) {
    const fullData = {
      ...structuredClone(data),
      gtmOnSuccess: () => this.record("gtmOnSuccess", []),
      gtmOnFailure: () => this.record("gtmOnFailure", []),
    };
    compile(this.code)(fullData, (name) => this.require(name));
  }

  /** The apis of a scenario's code. */
  testApis() {
    const run = this;
    return {
      mock: (name, implementation) => {
        run.mocks[name] = implementation;
      },
      runCode: (data) => run.runCode(data),
      assertApi: (name) => ({
        wasCalled: () => {
          if (!run.calls[name]?.length) throw new Error(`expected ${name} to have been called`);
        },
        wasNotCalled: () => {
          if (run.calls[name]?.length)
            throw new Error(`expected ${name} not to have been called, but it was: ${JSON.stringify(run.calls[name])}`);
        },
        wasCalledWith: (...expected) => {
          const calls = run.calls[name] ?? [];
          if (!calls.some((args) => isDeepStrictEqual(args.slice(0, expected.length), expected))) {
            throw new Error(
              `expected ${name} to have been called with ${JSON.stringify(expected)}, but its calls were ${JSON.stringify(calls)}`,
            );
          }
        },
      }),
      assertThat: (actual) => ({
        isEqualTo: (expected) => {
          if (!isDeepStrictEqual(actual, expected))
            throw new Error(`expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
        },
        isNotEqualTo: (expected) => {
          if (isDeepStrictEqual(actual, expected))
            throw new Error(`expected ${JSON.stringify(actual)} not to equal it`);
        },
        isTrue: () => {
          if (actual !== true) throw new Error(`expected ${JSON.stringify(actual)} to be true`);
        },
        isFalse: () => {
          if (actual !== false) throw new Error(`expected ${JSON.stringify(actual)} to be false`);
        },
        isUndefined: () => {
          if (actual !== undefined) throw new Error(`expected ${JSON.stringify(actual)} to be undefined`);
        },
        isDefined: () => {
          if (actual === undefined) throw new Error("expected a value");
        },
      }),
      fail: (message) => {
        throw new Error(message ?? "fail()");
      },
    };
  }
}

/** Runs one of the template's scenarios, with its setup, as GTM does: setup's code, then the scenario's. */
export function runScenario(parsed, scenario) {
  const run = new Run(parsed);
  const apis = run.testApis();
  const names = ["require", ...Object.keys(apis)];
  const body = `${parsed.tests.setup ?? ""}\n${scenario.code}`;
  new Function(...names, body)((name) => run.require(name), ...Object.values(apis));
  return run;
}
