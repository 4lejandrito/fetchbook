import colorizer from "json-colorizer";
import { RequestStory } from "..";
import path from "path";
import picocolors from "picocolors";
import autocomplete, { Separator } from "inquirer-autocomplete-standalone";
import Fuse from "fuse.js";
import { glob } from "glob";
import spaceCase from "to-space-case";
import titleize from "titleize";

export const getStory = (storyFilePath: string) =>
  import(path.resolve(storyFilePath)).then(
    (mod) => mod.default as RequestStory,
  );

export const findStory = async (storyFilePath?: string) => {
  if (storyFilePath) {
    return getStory(storyFilePath);
  } else {
    const pattern = "**/*.fetch.ts";
    const storyFiles = await glob(pattern, {
      ignore: ["node_modules/**"],
    });
    if (storyFiles.length === 0) {
      console.log(`No story files (${pattern}) found`);
      process.exit(0);
    }
    const items = await Promise.all(
      storyFiles.map(async (file) => ({ file, story: await getStory(file) })),
    );
    const fuse = new Fuse(items, {
      keys: [
        {
          name: "title",
          getFn: (item) => item.story.name,
        },
      ],
    });
    return await autocomplete({
      message: "Select a fetch story",
      source: async (input) => {
        const results = input
          ? fuse.search(input).map((result) => result.item)
          : items;
        const groups: { [K: string]: RequestStory[] } = {};
        await Promise.all(
          results.map(async (item) => {
            const group = path.dirname(item.file);
            groups[group] ??= [];
            groups[group].push(item.story);
          }),
        );
        return Object.keys(groups)
          .map((group) => [
            new Separator(
              picocolors.gray(
                group.split(path.sep).map(spaceCase).map(titleize).join(" / "),
              ),
            ),
            ...groups[group].map((story) => ({
              name: story.name,
              value: story,
              description: `${picocolors.green(story.request.method)} ${
                story.url
              }`,
            })),
          ])
          .flat();
      },
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
