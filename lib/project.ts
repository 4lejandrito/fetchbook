import { mkdir, writeFile, copy, exists } from "fs-extra";
import path from "path";
import { $ } from "execa";
import { version } from "../package.json";

export async function createProject(name: string) {
  await mkdir(name);
  await writeFile(
    path.join(name, "package.json"),
    JSON.stringify(
      {
        name: `${name}-fetchbook`,
        version: "1.0.0",
        description: `${name}'s fetchbook`,
        scripts: {
          test: "fetchbook run --all",
        },
      },
      null,
      2,
    ),
  );
  await initProject(name);
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
    path.join(import.meta.dir, "..", "examples"),
    path.join(cwd, "fetchbook", "samples"),
  );
}
