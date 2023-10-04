#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");

spawnSync(
  "bun",
  ["run", path.join(__dirname, "..", "cli.ts"), ...process.argv.slice(2)],
  {
    stdio: "inherit",
  },
);
