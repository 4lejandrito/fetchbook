import { afterAll, beforeAll, expect, test } from "bun:test";
import { $ } from "execa";
import server from "./server";

function $test(command: TemplateStringsArray) {
  test(command.toString(), async () => {
    const { exitCode, stdout, stderr } = await $(command);
    expect(exitCode).toMatchSnapshot();
    expect(stdout).toMatchSnapshot();
    expect(stderr).toMatchSnapshot();
  });
}

beforeAll(server.start);
afterAll(server.stop);

$test`fetchbook`;
$test`fetchbook --help`;
$test`fetchbook run --all`;
$test`fetchbook run test/posts/add-post.fetch.ts`;
$test`fetchbook export --all`;
$test`fetchbook export test/posts/add-post.fetch.ts`;
