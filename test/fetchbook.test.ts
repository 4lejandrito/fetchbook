import { expect, test } from "bun:test";
import { $, TemplateExpression } from "execa";
import { resolve } from "path";

function $test(
  command: TemplateStringsArray,
  ...expressions: TemplateExpression[]
) {
  test(String.raw({ raw: command }, ...expressions), async () => {
    const { exitCode, stdout, stderr } = await $(command, ...expressions);
    expect(exitCode).toMatchSnapshot();
    expect(stdout.replaceAll(/\s*"date": ".+",?/g, "")).toMatchSnapshot();
    expect(stderr).toMatchSnapshot();
  });
}

$test`fetchbook`;
$test`fetchbook --help`;
$test`fetchbook --version`;
$test`fetchbook run --all`;
$test`fetchbook run test/pass --all`;
$test`fetchbook run test/pass --all -v`;
$test`fetchbook run test/fail --all`;
$test`fetchbook run test --all`;
$test`fetchbook run examples --all`;
$test`fetchbook run test/pass/add-post.fetch.ts`;
$test`fetchbook run ${resolve("test/pass/add-post.fetch.ts")}`;
$test`fetchbook run ${resolve("test/pass/add-post.fetch.ts")} -v`;
$test`fetchbook run test/fail/get-posts.fetch.ts`;
$test`fetchbook export --all`;
$test`fetchbook export test/pass/add-post.fetch.ts`;
