import colorizer from "json-colorizer";
import { RequestStory } from "..";
import path from "path";
import { program } from "commander";
import picocolors from "picocolors";

const serializeObject = (json: object) =>
  colorizer(JSON.stringify(json), { pretty: true });
const serializeBlob = async (blob: Blob) =>
  blob.type.includes("application/json") ? blob.json() : undefined;

program
  .name("fetchbook")
  .argument("<story>", "story file path")
  .option("-v, --verbose", "verbose")
  .option("-d, --dry-run", "dry run")
  .action(async (storyFilePath, options) => {
    await (async function run(story: RequestStory) {
      for (const beforeStory of story.before ?? []) {
        await run(beforeStory);
      }
      const request = new Request(story.url, story.request);
      let response: Response | undefined;
      if (!options.dryRun) {
        response = await fetch(request);
      }
      console.log(
        picocolors.green("✓"),
        story.name,
        response?.status ?? picocolors.yellow("Dry run")
      );
      if (options.verbose) {
        console.log(
          serializeObject({
            request: {
              url: request.url,
              method: request.method,
              headers: request.headers.count > 0 ? request.headers : undefined,
              body: await serializeBlob(await request.blob()),
            },
            response: response
              ? {
                  status: response.status,
                  headers:
                    response.headers.count > 0 ? response.headers : undefined,
                  body: await serializeBlob(await response.blob()),
                }
              : undefined,
          })
        );
      }
      for (const afterStory of story.after ?? []) {
        await run(afterStory);
      }
    })(
      await import(path.resolve(storyFilePath)).then(
        (mod) => mod.default as RequestStory
      )
    );
  })
  .parse();
