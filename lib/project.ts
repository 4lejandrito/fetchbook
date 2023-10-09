import { mkdir, writeJson, copy, exists } from "fs-extra";
import path from "path";
import { $ } from "execa";
import { version } from "../package.json";

export async function createProject(name: string) {
  await mkdir(name);
  await writeJson(path.join(name, "package.json"), {
    name: `${name}-fetchbook`,
    version: "1.0.0",
    description: `${name}'s fetchbook`,
    scripts: {
      test: "fetchbook run --all",
    },
  });
  await initProject(name);
  await $`prettier --write ${name}`;
}

export async function initProject(cwd = ".") {
  if (!(await exists(path.join(cwd, "package.json")))) {
    throw "You must run init inside the root of a node project";
  }
  await $`add-dependencies ${path.join(
    cwd,
    "package.json",
  )} --dev fetchbook@^${version}`;
  await copy(
    path.join(__dirname, "..", "examples"),
    path.join(cwd, "fetchbook"),
  );
}
