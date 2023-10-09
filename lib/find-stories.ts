import { FetchStory } from "fetchbook";
import path from "path";
import picocolors from "picocolors";
import autocomplete, { Separator } from "inquirer-autocomplete-standalone";
import Fuse from "fuse.js";
import { glob } from "glob";
import spaceCase from "to-space-case";
import titleize from "titleize";

const getStory = (storyFilePath: string) =>
  import(storyFilePath).then((mod) => mod.default as FetchStory);

const packageRoot = path.join(__dirname, "..");
const isFetchbookFile = (file: string) => {
  const relative = path.relative(packageRoot, file);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
};

const getStoryFilePath = (
  storyFilePath?: string,
  options?: { demo?: boolean },
) =>
  options?.demo
    ? path.relative(process.cwd(), path.join(packageRoot, "examples"))
    : storyFilePath;

export default async function findStories(
  storyFilePath?: string,
  options?: { demo?: boolean; all?: boolean },
) {
  storyFilePath = getStoryFilePath(storyFilePath, options);
  if (storyFilePath?.endsWith(".ts")) {
    return [await getStory(path.resolve(storyFilePath))];
  } else {
    const pattern = "**/*.fetch.ts";
    const cwd = storyFilePath
      ? path.join(process.cwd(), storyFilePath)
      : process.cwd();
    const storyFiles = (await glob(pattern, { cwd }))
      .map((file) => path.join(cwd, file))
      .filter(
        (file) => isFetchbookFile(file) || !file.includes("node_modules"),
      );
    if (storyFiles.length === 0) {
      console.log(`No story files (${pattern}) found`);
      process.exit(0);
    }
    const items = await Promise.all(
      storyFiles.map(async (file) => ({
        file,
        story: await getStory(file),
      })),
    );
    if (options?.all) {
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
              const group = path.dirname(
                path.relative(
                  isFetchbookFile(item.file) ? packageRoot : cwd,
                  item.file,
                ),
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
