import { describe, expect, it } from "vitest";

import { Run, runScenario, template } from "./harness.mjs";

const parsed = template();

describe("template.tpl's ___TESTS___", () => {
  it("has scenarios", () => {
    expect(parsed.tests.scenarios.length).toBeGreaterThan(5);
  });

  it.each(parsed.tests.scenarios.map((scenario) => [scenario.name, scenario]))("%s", (_name, scenario) => {
    runScenario(parsed, scenario);
  });
});

describe("the harness", () => {
  it("fails a scenario whose assertion fails", () => {
    expect(() => runScenario(parsed, { code: "runCode(mockData); assertApi('injectScript').wasNotCalled();" })).toThrow(
      /not to have been called/,
    );
    expect(() => runScenario(parsed, { code: "assertThat(1).isEqualTo(2);" })).toThrow(/to equal/);
    expect(() => runScenario(parsed, { code: "fail('no');" })).toThrow("no");
  });

  it("enforces the declared permissions", () => {
    const withoutGlobals = new Run({ code: parsed.code, permissions: parsed.permissions.slice(0, 2) });
    expect(() => withoutGlobals.runCode({ chatbot: "https://chat.example.com/", version: "0.9.0" })).toThrow(
      /access_globals/,
    );
    const run = new Run(parsed);
    expect(() => run.require("sendPixel")).toThrow(/doesn't fake/);
    expect(() => run.api("setInWindow")("document", {}, true)).toThrow(/no write permission for document/);
    expect(() => run.api("injectScript")("https://evil.example.com/x.js", () => {})).toThrow(/not permitted/);
  });

  it("loads the embed script once, with the options of every tag that fired before it ran", () => {
    const run = new Run(parsed);
    run.runCode({ chatbot: "https://sales.example.com/", version: "0.9.0" });
    run.runCode({ chatbot: "https://support.example.com/", target: "#chat", version: "0.9.0" });
    expect(run.window.SmarterChatConfig).toEqual([
      { chatbot: "https://sales.example.com/", mode: "launcher" },
      { chatbot: "https://support.example.com/", target: "#chat", mode: "inline" },
    ]);
    // the cache token: GTM injects a script once per token.
    expect(new Set(run.calls.injectScript.map((args) => args[3])).size).toBe(1);
  });

  it("mounts through the embed script's own api once it has run", () => {
    const run = new Run(parsed);
    const mounted = [];
    run.window.SmarterChat = { version: "0.9.0", mount: (options) => mounted.push(options) };
    run.runCode({ chatbot: "https://sales.example.com/", open: true, version: "0.9.0" });
    expect(mounted).toEqual([{ chatbot: "https://sales.example.com/", mode: "launcher", open: true }]);
    expect(run.calls.injectScript).toBeUndefined();
  });
});
