/**
 * Sets the Embed script version field's default, and the code's fallback, to an exact version of @smarter.sh/ui-chat:
 * `make embed-version V=0.9.1`. See doc/adr/004-cdn.md.
 */
import fs from "node:fs";
import path from "node:path";

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version ?? "")) {
  console.error("usage: npm run embed-version -- <exact version, e.g. 0.9.1>");
  process.exit(2);
}
const file = path.resolve(import.meta.dirname, "../template.tpl");
let source = fs.readFileSync(file, "utf-8");
source = source.replace(/("name": "version",[\s\S]*?"defaultValue": ")[^"]+(")/, `$1${version}$2`);
source = source.replace(/data\.version \|\| '[^']+'/, `data.version || '${version}'`);
source = source.replace(/(version: ')[^']+(')/, `$1${version}$2`);
fs.writeFileSync(file, source);
console.log(`The default embed script is @smarter.sh/ui-chat@${version}.`);
