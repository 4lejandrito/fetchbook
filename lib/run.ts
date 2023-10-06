import { FetchStory } from "..";
import picocolors from "picocolors";
import expect from "expect";
import serialize from "./serialize";

async function readBody(source: Request | Response) {
  if (source.headers.get("content-type")?.includes("application/json")) {
    return source.json();
  } else {
    return source.text();
  }
}

export default async function run(
  story: FetchStory,
  request: Request,
  options: { dryRun?: boolean; verbose?: boolean },
) {
  let response: Response | undefined;
  let body: string | undefined;
  if (!options.dryRun) {
    try {
      response = await fetch(request.clone());
      body = await readBody(response);
      if (story.expect) {
        expect({
          status: response.status,
          statusText: response.statusText,
          headers: response.headers.toJSON(),
          body,
        }).toMatchObject(story.expect);
      }
    } catch (err: any) {
      console.log(picocolors.red("✘"), story.name, response?.status ?? "");
      console.error(response ? err.message : err);
      process.exit(1);
    }
  }
  console.log(
    picocolors.green("✔"),
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
          body: await readBody(request),
        },
        response: response
          ? {
              status: response.status,
              headers:
                response.headers.count > 0 ? response.headers : undefined,
              body,
            }
          : undefined,
      }),
    );
  }
}
