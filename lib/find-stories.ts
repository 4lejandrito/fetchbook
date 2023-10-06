import { FetchStory } from "..";
import path from "path";
import picocolors from "picocolors";
import autocomplete, { Separator } from "inquirer-autocomplete-standalone";
import Fuse from "fuse.js";
import { glob } from "glob";
import spaceCase from "to-space-case";
import titleize from "titleize";

const getStory = (storyFilePath: string) =>
  import(path.resolve(storyFilePath)).then((mod) => mod.default as FetchStory);

export default async function findStories(
  storyFilePath?: string,
  all?: boolean,
) {
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
          const packageRoot = path.join(__dirname, "..");
          await Promise.all(
            results.map(async (item) => {
              const relative = path.relative(packageRoot, item.file);
              const group = path.dirname(
                relative &&
                  !relative.startsWith("..") &&
                  !path.isAbsolute(relative)
                  ? relative
                  : item.file,
              );
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
}
