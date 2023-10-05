import { program } from "commander";
import { getCurl, findStories, run, visit } from "./lib/functions";

program
  .name("fetchbook")
  .description("Manage your HTTP requests")
  .argument("[story]", "story file path")
  .option("-a, --all", "process all stories in a folder recursively")
  .option("-v, --verbose", "verbose")
  .option("-d, --dry-run", "dry run")
  .option("-c, --curl", "convert to curl")
  .action(async (storyFilePath, options) =>
    visit(await findStories(storyFilePath, options.all), async (story) => {
      const request = new Request(story.url, story.init);
      if (options.curl) {
        console.log(await getCurl(request));
      } else {
        await run(story.name, request, options);
      }
    }),
  )
  .parse();
