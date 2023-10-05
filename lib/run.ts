import { FetchStory } from "..";
import picocolors from "picocolors";
import expect from "expect";
import serialize from "./serialize";

export default async function run(
  story: FetchStory,
  request: Request,
  options: { dryRun?: boolean; verbose?: boolean },
) {
  let response: Response | undefined;
  if (!options.dryRun) {
    response = await fetch(request.clone());
    if (story.expect) {
      expect({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers.toJSON(),
      }).toMatchObject(story.expect);
    }
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
}
