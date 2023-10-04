import colorizer from "json-colorizer";
import { RequestStory } from "..";
import path from "path";
import picocolors from "picocolors";
import select from "@inquirer/select";
import { glob } from "glob";

export const getStory = (storyFilePath: string) =>
  import(path.resolve(storyFilePath)).then(
    (mod) => mod.default as RequestStory,
  );

export const findStory = async (storyFilePath?: string) => {
  if (storyFilePath) {
    return getStory(storyFilePath);
  } else {
    const storyFiles = await glob(`${process.cwd()}/**/*.fetch.ts`);
    if (storyFiles.length === 0) {
      console.log("No story files (*.fetch.ts) found");
      process.exit(0);
    }
    const stories = await Promise.all(storyFiles.map(getStory));
    return select({
      message: "Select a fetch story",
      choices: stories.map((story) => ({
        name: story.name,
        value: story,
        description: story.url,
      })),
    });
  }
};

export const visit = async (
  story: RequestStory,
  visitor: (request: Request, story: RequestStory) => Promise<void>,
) => {
  for (const beforeStory of story.before ?? []) {
    await visit(beforeStory, visitor);
  }
  await visitor(new Request(story.url, story.request), story);
  for (const afterStory of story.after ?? []) {
    await visit(afterStory, visitor);
  }
};

export const serialize = async (object: any): Promise<string | undefined> =>
  object instanceof Blob
    ? object.type.includes("application/json")
      ? await object.json()
      : undefined
    : typeof object === "object"
    ? colorizer(JSON.stringify(object), { pretty: true })
    : undefined;

export const run = async (
  story: RequestStory,
  options: { dryRun?: boolean; verbose?: boolean },
) => {
  visit(story, async (request, story) => {
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
  });
};
