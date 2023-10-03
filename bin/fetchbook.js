#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");
const cwd = path.join(__dirname, "..", "cli")

spawnSync("bun", ["install"], { cwd });
spawnSync("bun", ["run", path.join(cwd, "fetchbook-cli.ts"), ...process.argv.slice(2)], {
  stdio: "inherit",
});
