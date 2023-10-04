import { program } from "commander";
import fetchToCurl from "fetch-to-curl";
import { findStory, run, serialize, visit } from "./lib/functions";

program
  .name("fetchbook")
  .description("Manage your HTTP requests")
  .argument("[story]", "story file path")
  .option("-v, --verbose", "verbose")
  .option("-d, --dry-run", "dry run")
  .option("-c, --curl", "convert to curl")
  .action(async (storyFilePath, options) => {
    const story = await findStory(storyFilePath);
    if (options.curl) {
      visit(story, async (request) =>
        console.log(
          fetchToCurl({
            url: request.url,
            method: request.method,
            headers: request.headers,
            body: await serialize(await request.blob()),
          })
        )
      );
    } else {
      run(story, options);
    }
  })
  .parse();
