import colorizer from "json-colorizer";
import { RequestStory } from "../..";
import path from "path";

export const getStory = (storyFilePath: string) =>
  import(path.resolve(storyFilePath)).then(
    (mod) => mod.default as RequestStory,
  );

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
