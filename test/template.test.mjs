import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { describe, expect, it } from "vitest";

import { SECTION_NAMES, sections, template } from "./harness.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const parsed = template();

/** Every field, with the fields of groups. */
function fields(parameters) {
  return parameters.flatMap((parameter) => [parameter, ...fields(parameter.subParams ?? [])]);
}

// the names that containers store values by. Removing or renaming one loses them (doc/adr/008-gallery.md).
const FIELD_NAMES = [
  "chatbot",
  "apiKey",
  "position",
  "label",
  "color",
  "open",
  "advanced",
  "target",
  "height",
  "version",
];

describe("template.tpl", () => {
  it("has GTM's sections, in GTM's order", () => {
    expect(Object.keys(sections())).toEqual(SECTION_NAMES);
    expect(sections().___TERMS_OF_SERVICE___).toContain("https://developers.google.com/tag-manager/gallery-tos");
  });

  it("is a web tag, with a brand and a thumbnail", () => {
    expect(parsed.info).toMatchObject({ type: "TAG", displayName: "Smarter Chat", containerContexts: ["WEB"] });
    expect(parsed.info.brand.thumbnail).toMatch(/^data:image\/png;base64,/);
  });

  it("keeps its field names, which are unique, and each field has help or a label", () => {
    const all = fields(parsed.parameters);
    const names = all.map((field) => field.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual(expect.arrayContaining(FIELD_NAMES));
    for (const field of all) {
      if (field.type === "GROUP") continue;
      expect(field.help ?? field.checkboxText, field.name).toBeTruthy();
    }
  });

  it("validates its fields with regular expressions that accept the defaults and reject bad values", () => {
    const byName = Object.fromEntries(fields(parsed.parameters).map((field) => [field.name, field]));
    const accepts = (name, value) =>
      (byName[name].valueValidators ?? [])
        .filter((validator) => validator.type === "REGEX")
        .every((validator) => new RegExp(validator.args[0]).test(value));
    expect(accepts("chatbot", "https://support.3141-5926-5359.api.example.com/")).toBe(true);
    expect(accepts("chatbot", "javascript:alert(1)")).toBe(false);
    expect(accepts("chatbot", 'https://x.example.com/"><script>')).toBe(false);
    expect(accepts("color", byName.color.defaultValue)).toBe(true);
    expect(accepts("color", "red")).toBe(false);
    expect(accepts("height", "70vh")).toBe(true);
    expect(accepts("height", "1px;x")).toBe(false);
    expect(accepts("version", byName.version.defaultValue)).toBe(true);
    expect(accepts("version", "0.9")).toBe(true);
    expect(accepts("version", "latest/../../x")).toBe(false);
    expect(accepts("apiKey", "")).toBe(true);
    expect(accepts("apiKey", "a b")).toBe(false);
  });

  it("defaults to the embed script version in its code", () => {
    const version = fields(parsed.parameters).find((field) => field.name === "version").defaultValue;
    expect(parsed.code).toContain(`data.version || '${version}'`);
  });
});

describe("the Gallery's files", () => {
  it("are at the repository's root, with an Apache 2.0 license", () => {
    expect(fs.readFileSync(path.join(ROOT, "LICENSE"), "utf-8")).toContain("Apache License");
  });

  it("metadata.yaml is well formed, and its versions are commit shas", () => {
    const metadata = YAML.parse(fs.readFileSync(path.join(ROOT, "metadata.yaml"), "utf-8"));
    expect(metadata.homepage).toMatch(/^https:\/\//);
    expect(metadata.documentation).toMatch(/^https:\/\//);
    expect(Array.isArray(metadata.versions)).toBe(true);
    for (const version of metadata.versions) {
      expect(version.sha).toMatch(/^[0-9a-f]{40}$/);
      expect(version.changeNotes).toBeTruthy();
    }
  });
});
