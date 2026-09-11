import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const launcher = await readFile(new URL("../bin/vessel-browser.js", import.meta.url), "utf8");
const bootstrap = await readFile(new URL("../src/main/index.ts", import.meta.url), "utf8");

test("the public launcher always starts Vessel headlessly and forwards arguments", () => {
  assert.match(launcher, /VESSEL_HEADLESS:\s*"1"/);
  assert.match(launcher, /\[appPath,\s*"--headless",\s*\.\.\.process\.argv\.slice\(2\)\]/);
});

test("the Electron runtime suppresses every native window and dialog surface", () => {
  assert.match(bootstrap, /BrowserWindow\.prototype\.show\s*=\s*\(\)\s*=>\s*undefined/);
  assert.match(bootstrap, /BaseWindow\.prototype\.show\s*=\s*\(\)\s*=>\s*undefined/);
  assert.match(bootstrap, /showOpenDialog\s*=\s*async\s*\(\)\s*=>\s*\(\{\s*canceled:\s*true/);
  assert.match(bootstrap, /showSaveDialog\s*=\s*async\s*\(\)\s*=>\s*\(\{\s*canceled:\s*true/);
});
