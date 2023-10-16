import { expect, test } from "bun:test";
import { $ } from "execa";

function $test(command: TemplateStringsArray) {
  test(command.toString(), async () => {
    const { exitCode, stdout, stderr } = await $(command);
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
$test`fetchbook run test/fail/get-posts.fetch.ts`;
$test`fetchbook export --all`;
$test`fetchbook export test/pass/add-post.fetch.ts`;
