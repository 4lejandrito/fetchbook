import { Option, program } from "commander";
import visit from "./lib/visit";
import findStories from "./lib/find-stories";
import getCurl from "./lib/get-curl";
import run from "./lib/run";

program.name("fetchbook").description("Manage your HTTP requests");

program
  .command("run")
  .description("run your stories")
  .argument("[story]", "story file path")
  .option("-a, --all", "process all stories in a folder recursively")
  .option("-v, --verbose", "verbose")
  .option("-d, --dry-run", "dry run")
  .option("--demo", "use demo stories")
  .action(async (storyFilePath, options) =>
    visit(await findStories(storyFilePath, options), (story) =>
      run(story, options),
    ),
  );

program
  .command("export")
  .description("export your stories to existing formats")
  .argument("[story]", "story file path")
  .addOption(
    new Option("-f, --format <format>", "format")
      .choices(["curl"])
      .default("curl"),
  )
  .option("-a, --all", "process all stories in a folder recursively")
  .option("--demo", "use demo stories")
  .action(async (storyFilePath, options) =>
    visit(await findStories(storyFilePath, options), async (story) =>
      console.log(await getCurl(new Request(story.url, story.init))),
    ),
  );

program.parse();
