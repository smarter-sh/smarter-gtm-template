/**
 * The sandbox lint: GTM's sandboxed JavaScript accepts a subset of JavaScript, and fails only when the template is
 * imported or run. This rejects the rest, with ESLint's Linter, and checks the template's permissions.
 */
import { Linter } from "eslint";
import { describe, expect, it } from "vitest";

import { permissionValues, template } from "./harness.mjs";

const parsed = template();

const SANDBOX_RESTRICTED_SYNTAX = [
  "ArrowFunctionExpression",
  "AwaitExpression",
  "ClassDeclaration",
  "ClassExpression",
  "ForInStatement",
  "ForOfStatement",
  "Literal[regex]",
  "NewExpression",
  "SpreadElement",
  "RestElement",
  "TaggedTemplateExpression",
  "TemplateLiteral",
  "ThisExpression",
  "TryStatement",
  "UnaryExpression[operator='typeof']",
  "UnaryExpression[operator='delete']",
  "YieldExpression",
];

function lint(code, globals) {
  return new Linter().verify(code, {
    languageOptions: {
      ecmaVersion: 2017,
      sourceType: "script",
      globals: Object.fromEntries(globals.map((name) => [name, "readonly"])),
    },
    rules: {
      "no-undef": "error",
      "no-restricted-syntax": ["error", ...SANDBOX_RESTRICTED_SYNTAX],
    },
  });
}

describe("the sandbox lint", () => {
  it("accepts the template's code", () => {
    expect(lint(parsed.code, ["data", "require"])).toEqual([]);
  });

  it("accepts the scenarios' code, with GTM's test apis", () => {
    const apis = ["require", "mock", "runCode", "assertApi", "assertThat", "fail"];
    for (const scenario of parsed.tests.scenarios) {
      expect(lint(`${parsed.tests.setup}\n${scenario.code}`, apis), scenario.name).toEqual([]);
    }
  });

  it("rejects what the sandbox doesn't accept", () => {
    const rejected = [
      "const f = () => 1;",
      "const s = `x`;",
      "const r = /x/;",
      "const t = typeof data;",
      "const d = new Date();",
      "const a = [...data.list];",
      "window.x = 1;",
      "try { data.x(); } catch (e) {}",
    ];
    for (const code of rejected) expect(lint(code, ["data"]).length, code).toBeGreaterThan(0);
  });
});

describe("the permissions", () => {
  const values = permissionValues(parsed.permissions);

  it("are exactly those of doc/adr/003-permissions.md", () => {
    expect(values).toEqual({
      logging: { environments: "debug" },
      inject_script: { urls: ["https://cdn.jsdelivr.net/npm/@smarter.sh/ui-chat@*"] },
      access_globals: {
        keys: [
          { key: "SmarterChatConfig", read: true, write: true, execute: false },
          { key: "SmarterChat.version", read: true, write: false, execute: false },
          { key: "SmarterChat.mount", read: false, write: false, execute: true },
        ],
      },
    });
  });

  it("cover every api that the code requires", () => {
    const required = [...parsed.code.matchAll(/require\('([^']+)'\)/g)].map((match) => match[1]);
    const needs = {
      callInWindow: "access_globals",
      copyFromWindow: "access_globals",
      setInWindow: "access_globals",
      injectScript: "inject_script",
      logToConsole: "logging",
    };
    for (const api of required) if (needs[api]) expect(values, api).toHaveProperty(needs[api]);
    expect(required.sort()).toEqual([
      "callInWindow",
      "copyFromWindow",
      "encodeUriComponent",
      "getType",
      "injectScript",
      "logToConsole",
      "queryPermission",
      "setInWindow",
    ]);
  });
});
