import colorizer from "json-colorizer";
import { RequestStory } from "..";
import path from "path";
import { program } from "commander";

program
  .name("fetchbook")
  .argument("<story>", "story file path")
  .option("-v, --verbose", "verbose")
  .action(async (storyFilePath, options) => {
    const response = await (async function run(story: RequestStory) {
      for (const beforeStory of story.before ?? []) {
        await run(beforeStory);
      }
      const response = await fetch(story.url, story.request);
      if (options.verbose) {
        console.log("✓", story.name, response.status);
      }
      for (const afterStory of story.after ?? []) {
        await run(afterStory);
      }
      return response;
    })(
      await import(path.resolve(storyFilePath)).then(
        (mod) => mod.default as RequestStory,
      ),
    );
    console.log(
      colorizer(JSON.stringify(await response.json()), { pretty: true }),
    );
  })
  .parse();
