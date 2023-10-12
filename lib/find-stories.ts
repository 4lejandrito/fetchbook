import { FetchStory } from "fetchbook";
import path from "path";
import selectStory from "./select-story";
import { glob } from "glob";
import spaceCase from "to-space-case";
import titleize from "titleize";

const getStory = (storyFilePath: string) =>
  import(storyFilePath).then((mod) => mod.default as FetchStory);

const packageRoot = path.join(import.meta.dir, "..");
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
    const storyToFile = new Map<FetchStory, string>();
    const stories = (
      await Promise.all(
        (await glob(pattern, { cwd }))
          .map((file) => path.join(cwd, file))
          .filter(
            (file) =>
              (options?.demo && isFetchbookFile(file)) ||
              !file.includes("node_modules"),
          )
          .sort()
          .map(async (file) => {
            const story = await getStory(file);
            storyToFile.set(story, file);
            return story;
          }),
      )
    ).sort((a, b) => a.name.localeCompare(b.name));
    if (stories.length === 0) {
      throw `No story files (${pattern}) found`;
    }
    if (options?.all) {
      return stories;
    }
    return [
      await selectStory(stories, (story) =>
        path
          .dirname(
            path.relative(
              isFetchbookFile(storyToFile.get(story) ?? "") ? packageRoot : cwd,
              storyToFile.get(story) ?? "",
            ),
          )
          .split(path.sep)
          .map(spaceCase)
          .map(titleize)
          .join(" / "),
      ),
    ];
  }
}
