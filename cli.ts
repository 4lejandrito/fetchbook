import { program } from "commander";
import picocolors from "picocolors";
import fetchToCurl from "fetch-to-curl";
import { getStory, serialize, visit } from "./lib/functions";

program.name("fetchbook").description("Manage your HTTP requests");

program
  .command("run")
  .description("run a story file")
  .argument("<story>", "story file path")
  .option("-v, --verbose", "verbose")
  .option("-d, --dry-run", "dry run")
  .action(async (storyFilePath, options) =>
    visit(await getStory(storyFilePath), async (request, story) => {
      let response: Response | undefined;
      if (!options.dryRun) {
        response = await fetch(request.clone());
      }
      console.log(
        picocolors.green("✓"),
        story.name,
        response?.status ?? picocolors.yellow("Dry run"),
      );
      if (options.verbose) {
        console.log(
          await serialize({
            request: {
              url: request.url,
              method: request.method,
              headers: request.headers.count > 0 ? request.headers : undefined,
              body: await serialize(await request.blob()),
            },
            response: response
              ? {
                  status: response.status,
                  headers:
                    response.headers.count > 0 ? response.headers : undefined,
                  body: await serialize(await response.blob()),
                }
              : undefined,
          }),
        );
      }
    }),
  );

program
  .command("curl")
  .description("convert a story file to CURL")
  .argument("<story>", "story file path")
  .action(async (storyFilePath) =>
    visit(await getStory(storyFilePath), async (request) =>
      console.log(
        fetchToCurl({
          url: request.url,
          method: request.method,
          headers: request.headers,
          body: await serialize(await request.blob()),
        }),
      ),
    ),
  );

program.parse();
