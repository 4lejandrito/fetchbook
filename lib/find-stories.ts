import { FetchStory } from "fetchbook";
import path from "path";
import { glob } from "glob";
import selectStory from "./select-story";

export type FileFetchStory = FetchStory & { file: string };

const getStory = (storyFilePath: string) =>
  import(storyFilePath).then((mod) => mod.default as FetchStory);

export const packageRoot = path.join(import.meta.dir, "..");
export const isFetchbookFile = (file: string) => {
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
): Promise<FileFetchStory[]> {
  storyFilePath = getStoryFilePath(storyFilePath, options);
  if (storyFilePath?.endsWith(".ts")) {
    const file = path.resolve(storyFilePath);
    const story = await getStory(file);
    return [{ ...story, file }];
  } else {
    const pattern = "**/*.fetch.ts";
    const cwd = storyFilePath
      ? path.join(process.cwd(), storyFilePath)
      : process.cwd();
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
          .map(async (file) => ({ ...(await getStory(file)), file })),
      )
    ).sort((a, b) => a.name.localeCompare(b.name));
    if (stories.length === 0) {
      throw `No story files (${pattern}) found`;
    }
    if (options?.all) {
      return stories;
    }
    return [await selectStory(stories)];
  }
}
