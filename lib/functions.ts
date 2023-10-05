import colorizer from "json-colorizer";
import { FetchStory } from "..";
import path from "path";
import picocolors from "picocolors";
import autocomplete, { Separator } from "inquirer-autocomplete-standalone";
import Fuse from "fuse.js";
import { glob } from "glob";
import spaceCase from "to-space-case";
import titleize from "titleize";
import fetchToCurl from "fetch-to-curl";

export const getStory = (storyFilePath: string) =>
  import(path.resolve(storyFilePath)).then((mod) => mod.default as FetchStory);

export const findStories = async (storyFilePath?: string, all?: boolean) => {
  if (storyFilePath?.endsWith(".ts")) {
    return [await getStory(storyFilePath)];
  } else {
    const pattern = `${storyFilePath ? storyFilePath + "/" : ""}**/*.fetch.ts`;
    const storyFiles = (await glob(pattern)).filter(
      (file) => !file.includes("node_modules"),
    );
    if (storyFiles.length === 0) {
      console.log(`No story files (${pattern}) found`);
      process.exit(0);
    }
    const items = await Promise.all(
      storyFiles.map(async (file) => ({ file, story: await getStory(file) })),
    );
    if (all) {
      return items.map((item) => item.story);
    }
    const fuse = new Fuse(items, {
      keys: [
        {
          name: "title",
          getFn: (item) => item.story.name,
        },
      ],
    });
    return [
      await autocomplete({
        message: "Select a fetch story",
        source: async (input) => {
          const results = input
            ? fuse.search(input).map((result) => result.item)
            : items;
          const groups: { [K: string]: FetchStory[] } = {};
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
                  group
                    .split(path.sep)
                    .map(spaceCase)
                    .map(titleize)
                    .join(" / "),
                ),
              ),
              ...groups[group].map((story) => ({
                name: story.name,
                value: story,
                description: `${picocolors.green(story.init.method)} ${
                  story.url
                }`,
              })),
            ])
            .flat();
        },
      }),
    ];
  }
};

export const visit = async (
  stories: FetchStory[],
  visitor: (story: FetchStory) => Promise<void>,
) => {
  for (const story of stories) {
    await visit(story.before ?? [], visitor);
    await visitor(story);
    await visit(story.after ?? [], visitor);
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
  name: string,
  request: Request,
  options: { dryRun?: boolean; verbose?: boolean },
) => {
  let response: Response | undefined;
  if (!options.dryRun) {
    response = await fetch(request.clone());
  }
  console.log(
    picocolors.green("✓"),
    name,
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
};

export const getCurl = async (request: Request) =>
  fetchToCurl({
    url: request.url,
    method: request.method,
    headers: request.headers,
    body: await serialize(await request.blob()),
  });
