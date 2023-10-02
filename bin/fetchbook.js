#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");
const cwd = path.join(__dirname, "..", "cli")

spawnSync("bun", ["install"], { cwd });
spawnSync("bun", ["run", "fetchbook-cli.ts", path.resolve(process.argv[2])], {
  cwd,
  stdio: "inherit",
});
