import { program } from "commander";
import fetchToCurl from "fetch-to-curl";
import { findStories, run, serialize, visit } from "./lib/functions";

program
  .name("fetchbook")
  .description("Manage your HTTP requests")
  .argument("[story]", "story file path")
  .option("-a, --all", "process all stories in a folder recursively")
  .option("-v, --verbose", "verbose")
  .option("-d, --dry-run", "dry run")
  .option("-c, --curl", "convert to curl")
  .action(async (storyFilePath, options) => {
    for (const story of await findStories(storyFilePath, options.all)) {
      if (options.curl) {
        await visit(story, async (request) =>
          console.log(
            fetchToCurl({
              url: request.url,
              method: request.method,
              headers: request.headers,
              body: await serialize(await request.blob()),
            }),
          ),
        );
      } else {
        await run(story, options);
      }
    }
  })
  .parse();
